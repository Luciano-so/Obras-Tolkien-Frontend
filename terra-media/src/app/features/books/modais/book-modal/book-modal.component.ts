import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { OpenLibraryBook } from '../../models/open-library-book';
import { BookDetailsComponent } from '../book-details/book-details.component';
import { BookCommentsComponent } from '../book-comments/book-comments.component';

@Component({
  selector: 'app-authors-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatExpansionModule,
    MatIconModule,
    BookDetailsComponent,
    BookCommentsComponent
  ],
  templateUrl: './book-modal.component.html',
  styleUrls: ['./book-modal.component.scss']
})
export class BookModalComponent implements OnInit {
  @ViewChild(BookCommentsComponent) commentsComponent!: BookCommentsComponent;
  private dialogRef = inject(MatDialogRef<BookModalComponent>);
  private data = inject<{ book: OpenLibraryBook }>(MAT_DIALOG_DATA);

  book: OpenLibraryBook = this.data.book;
  selectedTab: 'details' | 'comments' = 'details';

  ngOnInit(): void {
  }

  closeModal(): void {
    this.dialogRef.close();
  }

  onAddComment() {
    if (this.selectedTab === 'comments' && this.commentsComponent) {
      this.commentsComponent.submitComment();
    }
  }
}
