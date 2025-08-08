import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { PasswordModalComponent } from './password-modal.component';
import { UserService } from '../../../services/user.service';
import { ToastService } from '../../../../../shared/toast/toast.service';
import { LoadingService } from '../../../../../shared/loading/service/loading.service';
import { ConfirmDialogService } from '../../../../../shared/confirm-dialog/services/confirm-dialog.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { of, throwError } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ApiResponse } from '../../../../../core/models/api-response';

describe('PasswordModalComponent', () => {
  let component: PasswordModalComponent;
  let fixture: ComponentFixture<PasswordModalComponent>;

  let userServiceSpy: jasmine.SpyObj<UserService>;
  let toastServiceSpy: jasmine.SpyObj<ToastService>;
  let loadingServiceSpy: jasmine.SpyObj<LoadingService>;
  let confirmDialogSpy: jasmine.SpyObj<ConfirmDialogService>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<PasswordModalComponent>>;

  const mockDialogData = { user: { id: '123', name: 'Usuário Teste' } };

  beforeEach(async () => {
    userServiceSpy = jasmine.createSpyObj('UserService', ['updatePassword']);
    toastServiceSpy = jasmine.createSpyObj('ToastService', ['onShowOk', 'onShowError']);
    loadingServiceSpy = jasmine.createSpyObj('LoadingService', ['show', 'close']);
    confirmDialogSpy = jasmine.createSpyObj('ConfirmDialogService', ['openConfirm']);
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [PasswordModalComponent, NoopAnimationsModule],
      providers: [
        { provide: UserService, useValue: userServiceSpy },
        { provide: ToastService, useValue: toastServiceSpy },
        { provide: LoadingService, useValue: loadingServiceSpy },
        { provide: ConfirmDialogService, useValue: confirmDialogSpy },
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: mockDialogData }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PasswordModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve validar igualdade de senha e confirmação', () => {
    component.form.setValue({
      password: '123456',
      confirmPassword: 'diferente'
    });
    component.form.updateValueAndValidity();

    expect(component.form.valid).toBeFalse();
    expect(component.form.get('confirmPassword')?.errors?.['passwordEqual']).toBeTrue();
  });

  it('deve submeter o formulário com sucesso após confirmação', fakeAsync(() => {
    component.form.setValue({
      password: '123456',
      confirmPassword: '123456'
    });
    fixture.detectChanges();

    confirmDialogSpy.openConfirm.and.returnValue(of(true));
    userServiceSpy.updatePassword.and.returnValue(of({} as ApiResponse<void>));

    component.onSubmit();
    tick();

    expect(confirmDialogSpy.openConfirm).toHaveBeenCalled();
    expect(loadingServiceSpy.show).toHaveBeenCalled();
    expect(userServiceSpy.updatePassword).toHaveBeenCalledWith({ id: '123', password: '123456' });
    expect(toastServiceSpy.onShowOk).toHaveBeenCalledWith('Senha atualizada com sucesso.');
    expect(dialogRefSpy.close).toHaveBeenCalledWith(true);
    expect(loadingServiceSpy.close).toHaveBeenCalled();
  }));

  it('não deve chamar updatePassword se a confirmação for negativa', fakeAsync(() => {
    component.form.setValue({
      password: '123456',
      confirmPassword: '123456'
    });

    confirmDialogSpy.openConfirm.and.returnValue(of(false));

    component.onSubmit();
    tick();

    expect(confirmDialogSpy.openConfirm).toHaveBeenCalled();
    expect(userServiceSpy.updatePassword).not.toHaveBeenCalled();
    expect(toastServiceSpy.onShowOk).not.toHaveBeenCalled();
    expect(dialogRefSpy.close).not.toHaveBeenCalledWith(true);
  }));

  it('deve exibir erro ao falhar na alteração de senha', fakeAsync(() => {
    component.form.setValue({
      password: '123456',
      confirmPassword: '123456'
    });

    confirmDialogSpy.openConfirm.and.returnValue(of(true));
    userServiceSpy.updatePassword.and.returnValue(throwError(() => new Error('Erro')));

    component.onSubmit();
    tick();

    expect(toastServiceSpy.onShowError).toHaveBeenCalledWith('Houve um problema ao atualizar a senha, tente mais tarde.');
    expect(dialogRefSpy.close).not.toHaveBeenCalledWith(true);
    expect(loadingServiceSpy.close).toHaveBeenCalled();
  }));

  it('deve fechar o diálogo ao cancelar', () => {
    component.onCancel();
    expect(dialogRefSpy.close).toHaveBeenCalledWith(false);
  });
});
