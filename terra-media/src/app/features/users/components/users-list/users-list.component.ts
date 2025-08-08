import { Component, OnInit, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource } from '@angular/material/table';
import { UserDto } from '../../models/user.dto';
import { UserService } from '../../services/user.service';
import { LoadingService } from '../../../../shared/loading/service/loading.service';
import { finalize } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { PasswordModalComponent } from './modais/password-modal.component';
import { ConfirmDialogService } from '../../../../shared/confirm-dialog/services/confirm-dialog.service';
import { ToastService } from '../../../../shared/toast/toast.service';
import { UpdateStatusUserDto } from '../../models/update-status-user.dto';
import { UserCreateComponent } from '../users-create/user-create.component';

@Component({
  selector: 'app-user-list',
  standalone: true,
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
  ],
})
export class UserListComponent implements OnInit {
  private dialog = inject(MatDialog);
  private userService = inject(UserService);
  private loadingSrv = inject(LoadingService);
  private toastService = inject(ToastService);
  private confirmDialog = inject(ConfirmDialogService);
  users: UserDto[] = [];
  paginatedList: UserDto[] = [];

  dataSource = new MatTableDataSource<UserDto>([]);
  displayedColumns: string[] = ['name', 'login', 'active', 'actions'];

  pageSize = 10;
  currentPage = 0;
  items = 0;

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loadingSrv.show()
    this.userService.getAll()
      .pipe(finalize(() => this.loadingSrv.close()))
      .subscribe(users => {
        this.users = users.data;
        this.items = this.users.length;
        this.updatePage();
      });
  }

  updatePage(): void {
    this.loadingSrv.show()
    const start = this.currentPage * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedList = this.users.slice(start, end);
    this.dataSource.data = this.paginatedList;
    this.loadingSrv.close()
  }

  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.updatePage();
  }

  onViewUserDetails(user: UserDto): void {
    console.log('Visualizar usuário:', user);
  }

  onChangePassword(user: UserDto) {
    this.dialog.open(PasswordModalComponent, {
      width: '480px',
      maxWidth: '95vw',
      maxHeight: '80vh',
      disableClose: true,
      data: { user }
    });
  }

  onToggleUserStatus(user: UserDto): void {
    const isActivating = !user.active;
    const action = isActivating ? 'ativar' : 'desativar';
    const icon = isActivating ? 'person' : 'person_off';

    this.confirmDialog.openConfirm({
      title: 'Confirmação',
      message: `Deseja realmente ${action} o usuário "${user.name}"?`,
      confirmText: isActivating ? 'Ativar' : 'Desativar',
      cancelText: 'Cancelar',
      color: isActivating ? 'primary' : 'warn',
      icon: icon
    }).subscribe(result => {
      if (result) {

        const dto: UpdateStatusUserDto = {
          id: user.id,
          status: isActivating
        };

        this.loadingSrv.show()
        this.userService.updateStatus(dto)
          .pipe(finalize(() => this.loadingSrv.close()))
          .subscribe({
            next: () => {
              this.toastService.onShowOk(`Usuário ${action} com sucesso.`);
              this.loadUsers();
            },
            error: () => {
              this.toastService.onShowError(`Erro ao ${action} o usuário.`);
            }
          });
      }
    });
  }

  onCreateUser() {
    this.dialog.open(UserCreateComponent, {
      width: '550px',
      maxWidth: '95vw'
    }).afterClosed().subscribe(created => {
      if (created) {
        this.loadUsers();
      }
    });
  }
}
