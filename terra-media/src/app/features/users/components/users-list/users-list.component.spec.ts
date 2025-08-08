import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { UserListComponent } from './users-list.component';
import { UserService } from '../../services/user.service';
import { ToastService } from '../../../../shared/toast/toast.service';
import { LoadingService } from '../../../../shared/loading/service/loading.service';
import { ConfirmDialogService } from '../../../../shared/confirm-dialog/services/confirm-dialog.service';
import { MatDialog } from '@angular/material/dialog';
import { of, throwError } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ApiResponse } from '../../../../core/models/api-response';
import { UserDto } from '../../models/user.dto';

describe('UserListComponent', () => {
  let component: UserListComponent;
  let fixture: ComponentFixture<UserListComponent>;

  let userServiceSpy: jasmine.SpyObj<UserService>;
  let toastServiceSpy: jasmine.SpyObj<ToastService>;
  let loadingServiceSpy: jasmine.SpyObj<LoadingService>;
  let confirmDialogSpy: jasmine.SpyObj<ConfirmDialogService>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;

  const usersMock: UserDto[] = [
    { id: '1', name: 'User One', login: 'userone', active: true, createdAt: '2025-01-01' },
    { id: '2', name: 'User Two', login: 'usertwo', active: false, createdAt: '2025-01-02' },
  ];

  beforeEach(async () => {
    userServiceSpy = jasmine.createSpyObj('UserService', ['getAll', 'updateStatus']);
    toastServiceSpy = jasmine.createSpyObj('ToastService', ['onShowOk', 'onShowError']);
    loadingServiceSpy = jasmine.createSpyObj('LoadingService', ['show', 'close']);
    confirmDialogSpy = jasmine.createSpyObj('ConfirmDialogService', ['openConfirm']);
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      imports: [UserListComponent, NoopAnimationsModule],
      providers: [
        { provide: UserService, useValue: userServiceSpy },
        { provide: ToastService, useValue: toastServiceSpy },
        { provide: LoadingService, useValue: loadingServiceSpy },
        { provide: ConfirmDialogService, useValue: confirmDialogSpy },
        { provide: MatDialog, useValue: dialogSpy },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserListComponent);
    component = fixture.componentInstance;
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve carregar usuários na inicialização', fakeAsync(() => {
    const response: ApiResponse<UserDto[]> = {
      statusCode: 200,
      message: 'OK',
      data: usersMock
    };

    userServiceSpy.getAll.and.returnValue(of(response));
    loadingServiceSpy.show.and.stub();
    loadingServiceSpy.close.and.stub();

    fixture.detectChanges();

    tick();

    expect(loadingServiceSpy.show).toHaveBeenCalled();
    expect(userServiceSpy.getAll).toHaveBeenCalled();
    expect(component.users.length).toBe(usersMock.length);
    expect(component.dataSource.data.length).toBeLessThanOrEqual(component.pageSize);
    expect(loadingServiceSpy.close).toHaveBeenCalled();
  }));

  it('deve atualizar página quando paginator mudar', () => {
    component.users = usersMock;
    component.pageSize = 1;
    component.currentPage = 0;

    component.updatePage();
    expect(component.dataSource.data.length).toBe(1);

    component.currentPage = 1;
    component.updatePage();
    expect(component.dataSource.data[0].id).toBe(usersMock[1].id);
  });

  it('deve abrir modal de alteração de senha', () => {
    const user = usersMock[0];
    dialogSpy.open.and.returnValue({ afterClosed: () => of(true) } as any);

    component.onChangePassword(user);

    expect(dialogSpy.open).toHaveBeenCalled();
  });

  it('deve abrir modal de criação de usuário e recarregar usuários se criado', fakeAsync(() => {
    dialogSpy.open.and.returnValue({ afterClosed: () => of(true) } as any);
    const response: ApiResponse<UserDto[]> = {
      statusCode: 200,
      message: 'OK',
      data: usersMock
    };
    userServiceSpy.getAll.and.returnValue(of(response));
    loadingServiceSpy.show.and.stub();
    loadingServiceSpy.close.and.stub();

    component.onCreateUser();
    tick();

    expect(dialogSpy.open).toHaveBeenCalled();
    expect(userServiceSpy.getAll).toHaveBeenCalled();
  }));

  it('deve abrir confirmação e ativar usuário', fakeAsync(() => {
    const user = usersMock[1];
    confirmDialogSpy.openConfirm.and.returnValue(of(true));
    userServiceSpy.updateStatus.and.returnValue(of({ statusCode: 200, message: 'OK', } as ApiResponse<void>));
    userServiceSpy.getAll.and.returnValue(of({ statusCode: 200, message: 'OK', data: usersMock }));
    loadingServiceSpy.show.and.stub();
    loadingServiceSpy.close.and.stub();

    component.onToggleUserStatus(user);
    tick();

    expect(confirmDialogSpy.openConfirm).toHaveBeenCalled();
    expect(userServiceSpy.updateStatus).toHaveBeenCalledWith({ id: user.id, status: true });
    expect(toastServiceSpy.onShowOk).toHaveBeenCalledWith('Usuário ativar com sucesso.');
    expect(userServiceSpy.getAll).toHaveBeenCalled();
  }));

  it('deve abrir confirmação e desativar usuário', fakeAsync(() => {
    const user = usersMock[0];
    confirmDialogSpy.openConfirm.and.returnValue(of(true));
    userServiceSpy.updateStatus.and.returnValue(of({ statusCode: 200, message: 'OK' } as ApiResponse<void>));

    userServiceSpy.getAll.and.returnValue(of({ statusCode: 200, message: 'OK', data: usersMock }));
    loadingServiceSpy.show.and.stub();
    loadingServiceSpy.close.and.stub();

    component.onToggleUserStatus(user);
    tick();

    expect(confirmDialogSpy.openConfirm).toHaveBeenCalled();
    expect(userServiceSpy.updateStatus).toHaveBeenCalledWith({ id: user.id, status: false });
    expect(toastServiceSpy.onShowOk).toHaveBeenCalledWith('Usuário desativar com sucesso.');
    expect(userServiceSpy.getAll).toHaveBeenCalled();
  }));

  it('não deve atualizar status se confirmação for negada', fakeAsync(() => {
    const user = usersMock[0];
    confirmDialogSpy.openConfirm.and.returnValue(of(false));

    component.onToggleUserStatus(user);
    tick();

    expect(userServiceSpy.updateStatus).not.toHaveBeenCalled();
    expect(toastServiceSpy.onShowOk).not.toHaveBeenCalled();
  }));

  it('deve mostrar erro ao falhar atualização de status', fakeAsync(() => {
    const user = usersMock[0];
    confirmDialogSpy.openConfirm.and.returnValue(of(true));
    userServiceSpy.updateStatus.and.returnValue(throwError(() => new Error('erro')));
    loadingServiceSpy.show.and.stub();
    loadingServiceSpy.close.and.stub();

    component.onToggleUserStatus(user);
    tick();

    expect(toastServiceSpy.onShowError).toHaveBeenCalledWith('Erro ao desativar o usuário.');
  }));
});
