import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { UserCreateComponent } from './user-create.component';
import { UserService } from '../../services/user.service';
import { ToastService } from '../../../../shared/toast/toast.service';
import { LoadingService } from '../../../../shared/loading/service/loading.service';
import { MatDialogRef } from '@angular/material/dialog';
import { of, throwError } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ApiResponse } from '../../../../core/models/api-response';

describe('UserCreateComponent', () => {
  let component: UserCreateComponent;
  let fixture: ComponentFixture<UserCreateComponent>;
  let userServiceSpy: jasmine.SpyObj<UserService>;
  let toastServiceSpy: jasmine.SpyObj<ToastService>;
  let loadingServiceSpy: jasmine.SpyObj<LoadingService>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<UserCreateComponent>>;

  beforeEach(async () => {
    userServiceSpy = jasmine.createSpyObj('UserService', ['create']);
    toastServiceSpy = jasmine.createSpyObj('ToastService', ['onShowOk', 'onShowError']);
    loadingServiceSpy = jasmine.createSpyObj('LoadingService', ['show', 'close']);
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [UserCreateComponent, NoopAnimationsModule],
      providers: [
        { provide: UserService, useValue: userServiceSpy },
        { provide: ToastService, useValue: toastServiceSpy },
        { provide: LoadingService, useValue: loadingServiceSpy },
        { provide: MatDialogRef, useValue: dialogRefSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve iniciar com o formulário inválido', () => {
    expect(component.form.valid).toBeFalse();
  });

  it('deve validar igualdade de senha e confirmação', () => {
    component.form.setValue({
      name: 'Teste',
      login: 'teste',
      password: '123456',
      confirmPassword: 'diferente'
    });
    component.form.updateValueAndValidity();
    expect(component.form.valid).toBeFalse();
    expect(component.form.get('confirmPassword')?.errors?.['passwordEqual']).toBeTrue();
  });

  it('deve submeter o formulário com sucesso', fakeAsync(() => {
    const dto = { name: 'Teste', login: 'teste', password: '123456' };

    userServiceSpy.create.and.returnValue(of({} as ApiResponse<void>));

    component.form.setValue({
      ...dto,
      confirmPassword: '123456'
    });

    fixture.detectChanges();
    expect(component.form.valid).toBeTrue();
    component.onSubmit();
    tick();

    expect(loadingServiceSpy.show).toHaveBeenCalled();
    expect(userServiceSpy.create).toHaveBeenCalledWith(dto);
    expect(toastServiceSpy.onShowOk).toHaveBeenCalledWith('Usuário criado com sucesso!');
    expect(dialogRefSpy.close).toHaveBeenCalledWith(true);
    expect(loadingServiceSpy.close).toHaveBeenCalled();
  }));

  it('deve exibir erro ao falhar na criação do usuário', fakeAsync(() => {
    userServiceSpy.create.and.returnValue(
      throwError(() => ({ error: { message: 'Erro qualquer' } }))
    );

    component.form.setValue({
      name: 'Erro',
      login: 'erro',
      password: '123456',
      confirmPassword: '123456'
    });

    component.onSubmit();
    tick();

    expect(loadingServiceSpy.show).toHaveBeenCalled();
    expect(userServiceSpy.create).toHaveBeenCalled();
    expect(toastServiceSpy.onShowError).toHaveBeenCalledWith('Erro qualquer');
    expect(dialogRefSpy.close).not.toHaveBeenCalledWith(true);
    expect(loadingServiceSpy.close).toHaveBeenCalled();
  }));

  it('deve fechar o diálogo ao cancelar', () => {
    component.onCancel();
    expect(dialogRefSpy.close).toHaveBeenCalledWith(false);
  });
});
