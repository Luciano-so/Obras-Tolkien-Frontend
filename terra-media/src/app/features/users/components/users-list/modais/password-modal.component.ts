import { passwordEqualsValidator } from './../../../../../shared/validations/password-equals.validation';
import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserService } from '../../../services/user.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatErrorMessagesDirective } from '../../../../../shared/directives/matErrorMessagesDirective';
import { ConfirmDialogService } from '../../../../../shared/confirm-dialog/services/confirm-dialog.service';
import { ToastService } from '../../../../../shared/toast/toast.service';
import { finalize } from 'rxjs';
import { LoadingService } from '../../../../../shared/loading/service/loading.service';

@Component({
  selector: 'app-password-modal',
  templateUrl: './password-modal.component.html',
  styleUrls: ['./password-modal.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatErrorMessagesDirective
  ],
})
export class PasswordModalComponent {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private toastService = inject(ToastService);
  private loadingSrv = inject(LoadingService);
  private confirmDialog = inject(ConfirmDialogService);

  dialogRef = inject(MatDialogRef<PasswordModalComponent>);
  data = inject(MAT_DIALOG_DATA) as { user: { id: string; name: string } };

  form = this.fb.group({
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required, Validators.minLength(6)]]
  }, { validators: passwordEqualsValidator('password', 'confirmPassword') });

  get userId(): string {
    return this.data.user.id;
  }

  get userName(): string {
    return this.data.user.name;
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    this.confirmDialog.openConfirm({
      title: 'Confirmação',
      message: 'Deseja realmente alterar a senha?',
      confirmText: 'Sim',
      cancelText: 'Não',
      color: 'warn'
    }).subscribe(confirmed => {
      if (!confirmed) return;

      const password = this.form.value.password!;
      const id = this.userId;
      this.loadingSrv.show();
      this.userService.updatePassword({ id, password })
        .pipe(finalize(() => this.loadingSrv.close()))
        .subscribe({
          next: () => {
            this.toastService.onShowOk('Senha atualizada com sucesso.');
            this.dialogRef.close(true);
          },
          error: () => {
            this.toastService.onShowError('Houve um problema ao atualizar a senha, tente mais tarde.');
          }
        });
    });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
