import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { passwordEqualsValidator } from '../../../../shared/validations/password-equals.validation';
import { LoadingService } from '../../../../shared/loading/service/loading.service';
import { ToastService } from '../../../../shared/toast/toast.service';
import { MatErrorMessagesDirective } from '../../../../shared/directives/matErrorMessagesDirective';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-user-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatErrorMessagesDirective
  ],
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.scss']
})
export class UserCreateComponent {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private toastService = inject(ToastService);
  private loadingSrv = inject(LoadingService);
  private dialogRef = inject(MatDialogRef<UserCreateComponent>);

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(250)]],
    login: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(50)]],
    confirmPassword: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]]
  }, { validators: passwordEqualsValidator('password', 'confirmPassword') });

  onSubmit() {
    if (this.form.invalid) return;

    const { name, login, password } = this.form.value as { name: string; login: string; password: string };
    this.loadingSrv.show();
    this.userService.create({ name, login, password })
      .pipe(finalize(() => this.loadingSrv.close()))
      .subscribe({
        next: () => {
          this.toastService.onShowOk('Usuário criado com sucesso!');
          this.dialogRef.close(true);
        },
        error: (err) => {
          const errorMessage = err?.error?.message || err.message || 'Erro ao criar usuário. Tente novamente.';
          this.toastService.onShowError(errorMessage);
        },
      });
  }

  onCancel() {
    this.dialogRef.close(false);
  }
}
