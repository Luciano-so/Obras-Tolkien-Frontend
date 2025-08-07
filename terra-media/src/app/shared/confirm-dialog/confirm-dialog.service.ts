import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from './confirm-dialog.component';

@Injectable({ providedIn: 'root' })
export class ConfirmDialogService {
  constructor(private dialog: MatDialog) { }

  openConfirm(options: {
    title?: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    color?: string;
  }) {
    return this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: options.title || 'Confirmação',
        message: options.message,
        confirmText: options.confirmText || 'Confirmar',
        cancelText: options.cancelText || 'Voltar',
        color: options.color || 'warn',
      },
      disableClose: true
    }).afterClosed();
  }
}
