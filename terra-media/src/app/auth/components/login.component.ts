import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../../shared/toast/toast.service';
import { MatErrorMessagesDirective } from '../../shared/directives/matErrorMessagesDirective';
import { LoadingService } from '../../shared/loading/service/loading.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatErrorMessagesDirective
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authSrv = inject(AuthService);
  private toastSrv = inject(ToastService);
  private loadingSrv = inject(LoadingService);

  form: FormGroup = this.fb.group({
    login: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    password: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
  });

  hidePassword = true;

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }
    
    this.loadingSrv.show();
    this.authSrv.login(this.form.value)
      .pipe(finalize(() => this.loadingSrv.close()))
      .subscribe({
        next: (response) => {
          this.toastSrv.onShowOk(response.message);
          this.router.navigate(['/home']);
        },
        error: (err) => {
          this.toastSrv.onShowError(err.error.message);
        }
      });
  }
}
