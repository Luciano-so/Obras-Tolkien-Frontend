import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../auth/services/auth.service';
import { ToastService } from '../toast/toast.service';

@Component({
  selector: 'app-side-menu',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, MatMenuModule, MatButtonModule],
  templateUrl: './side-menu.component.html',
  styleUrl: './side-menu.component.scss',
})
export class SideMenuComponent implements OnInit {
  isCollapsed = signal(false);
  userName = signal('Usuário');
  version = signal('V1.0.0');
  userSubtitle = signal('Visitante');

  private router = inject(Router);
  private authService = inject(AuthService);
  private toastSrv = inject(ToastService);

  ngOnInit(): void {
    const user = this.authService.getUserInfo();
    if (user) {
      this.userName.set(user.userName);
      this.userSubtitle.set('Autenticado');
      this.version.set(user.version);
    }
  }

  toggleMenu(): void {
    this.isCollapsed.update(value => !value);
  }

  onLogout(): void {
    this.toastSrv.onShowOk('Logout realizado com sucesso.');
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  usersRoute(): void {
    this.router.navigate(['/users']);
  }

  menu(): void {
    this.toastSrv.onShowOk('Logout realizado com sucesso.');
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
