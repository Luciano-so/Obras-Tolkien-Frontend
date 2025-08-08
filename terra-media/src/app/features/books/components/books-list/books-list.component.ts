import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { OpenLibraryBook } from '../../models/open-library-book';
import { debounceTime, distinctUntilChanged, finalize } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { AuthorsModalComponent } from '../../modais/author-modal/author-modal.component';
import { BookModalComponent } from '../../modais/book-modal/book-modal.component';
import { OpenLibraryService } from '../../services/open-library.service';
import { LoadingService } from '../../../../shared/loading/service/loading.service';

@Component({
  selector: 'app-books-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatMenuModule,
  ],
  templateUrl: './books-list.component.html',
  styleUrls: ['./books-list.component.scss']
})
export class BooksListComponent implements OnInit {
  displayedColumns: string[] = ['title', 'author', 'publicationYear', 'actions'];
  dataSource = new MatTableDataSource<OpenLibraryBook>([]);
  form!: FormGroup;
  totalItems = 0;
  pageSize = 10;
  currentPage = 1;
  currentFilter = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  private fb = inject(FormBuilder);
  private dialog = inject(MatDialog);
  private loadingSrv = inject(LoadingService);
  private openLibrarySrv = inject(OpenLibraryService);

  ngOnInit() {
    this.form = this.fb.group({
      search: ['Tolkien', Validators.required]
    });
    this.form.get('search')?.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(() => {
      this.currentPage = 1;
      this.loadBooks();
    });
    this.loadBooks();
  }

  loadBooks() {
    if (this.form.invalid) {
      this.dataSource.data = [];
      this.totalItems = 0;
      if (this.paginator) {
        this.paginator.length = 0;
        this.paginator.pageIndex = 0;
      }
      return;
    }
    this.loadingSrv.show();
    const search = this.form.get('search')?.value.trim();
    this.openLibrarySrv.searchBooks(search, this.currentPage, this.pageSize)
      .pipe(finalize(() => this.loadingSrv.close()))
      .subscribe(result => {
        this.dataSource.data = result.docs;
        this.totalItems = result.numFound;
        if (this.paginator) {
          this.paginator.length = this.totalItems;
          this.paginator.pageIndex = this.currentPage - 1;
        }
      });
  }

  onAuthorPropertiesClick(authorKeys: string[]) {
    this.dialog.open(AuthorsModalComponent, {
      width: '850px',
      maxWidth: '100vw',
      maxHeight: '80vh',
      height: '658px',
      disableClose: true,
      data: authorKeys
    });
  }

  onBookPropertiesClick(book: OpenLibraryBook) {
    this.dialog.open(BookModalComponent, {
      width: '1200px',
      maxWidth: '100vw',
      maxHeight: '80vh',
      height: '658px',
      disableClose: true,
      data: { book }
    });
  }

  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex + 1;
    this.loadBooks();
  }
}
