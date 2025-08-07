import { Component, Inject, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BooksService } from '../../services/books.service';
import { ToastService } from '../../../../shared/toast/toast.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConfirmDialogService } from '../../../../shared/confirm-dialog/confirm-dialog.service';

@Component({
  selector: 'app-comment-details',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule
  ],
  templateUrl: './comment-details.component.html',
  styleUrls: ['./comment-details.component.scss']
})
export class CommentDetailsComponent implements OnInit {
  form: FormGroup;

  private booksService = inject(BooksService);
  private toastService = inject(ToastService);
  private confirmDialog = inject(ConfirmDialogService);

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CommentDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.fb.group({
      comment: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(1000)]],
    });
  }

  ngOnInit(): void {
    this.form.patchValue({ comment: this.data.comment.comment });
  }

  close(status: boolean): void {
    this.dialogRef.close(status);
  }

  edit(): void {
    if (this.form.invalid) {
      this.toastService.onShowError('O comentário não pode estar vazio.');
      return;
    }

    const updatedComment = this.form.value.comment.trim();

    this.booksService.updateComment(this.data.comment.bookId, this.data.comment.id, { comment: updatedComment }).subscribe({
      next: () => {
        this.toastService.onShowOk('Comentário atualizado com sucesso.');
        this.close(true);
      },
      error: (err) => {
        const msg = err?.error?.message || 'Erro ao atualizar comentário';
        this.toastService.onShowError(msg);
      }
    });
  }

  delete(): void {
    this.confirmDialog.openConfirm({
      title: 'Confirmação',
      message: 'Deseja realmente apagar permanentemente esse comentário?',
      confirmText: 'Apagar Permanentemente',
      cancelText: 'Voltar',
      color: 'warn'
    }).subscribe((result) => {
      if (result) {
        this.booksService.removeComment(this.data.comment.bookId, this.data.comment.id).subscribe({
          next: () => {
            this.toastService.onShowOk('Comentário removido com sucesso.');
            this.close(true);
          },
          error: (err) => {
            const msg = err?.error?.message || 'Erro ao remover comentário';
            this.toastService.onShowError(msg);
          }
        });
      }
    });
  }
}
