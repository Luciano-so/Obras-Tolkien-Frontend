import { Component, Input, OnInit, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CommentDetailsComponent } from '../comment-details/comment-details.component';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatErrorMessagesDirective } from '../../../../shared/directives/matErrorMessagesDirective';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BooksService } from '../../services/books.service';
import { ToastService } from '../../../../shared/toast/toast.service';
import { OpenLibraryBook } from '../../models/open-library-book';

@Component({
  selector: 'app-book-comments',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatErrorMessagesDirective
  ],
  templateUrl: './book-comments.component.html',
  styleUrls: ['./book-comments.component.scss']
})
export class BookCommentsComponent implements OnInit {
  private dialog = inject(MatDialog);
  @Input() book!: OpenLibraryBook;

  private fb = inject(FormBuilder);
  private booksService = inject(BooksService);
  private toastSrv = inject(ToastService);

  commentForm = this.fb.group({
    comment: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(1000)]],
    bookId: [null],
  });

  comments: any[] = [];

  ngOnInit(): void {
    this.loadBook();
  }

  loadBook(): void {
    const coverId = this.book.cover_i;
    if (!coverId) return;

    this.booksService.getBookByCoverId(coverId).subscribe({
      next: ({ id, comments = [] }) => {
        this.comments = comments;
        this.commentForm.get('bookId')?.setValue(id ?? null);
      },
      error: () => {
        this.comments = [];
      }
    });
  }

  openCommentDetails(comment: any): void {
    const dialogRef = this.dialog.open(CommentDetailsComponent, {
      width: '90vw',
      maxWidth: '900px',
      maxHeight: '80vh',
      data: { comment }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadBook();
      }
    });
  }

  submitComment(): void {
    if (this.commentForm.invalid) return;

    const comment = this.commentForm.get('comment')?.value ?? '';
    const bookId = this.commentForm.get('bookId')?.value ?? null;

    const commentDto = { comment };

    this.booksService.createOrAddComment(this.book.cover_i!, bookId, commentDto).subscribe({
      next: () => {
        this.toastSrv.onShowOk('Comentário adicionado com sucesso.');
        this.commentForm.get('comment')?.setValue('');
        this.loadBook();
      },
      error: (err) => {
        const message = err?.error?.message || 'Erro ao salvar comentário';
        this.toastSrv.onShowError(message);
      }
    });
  }
}
