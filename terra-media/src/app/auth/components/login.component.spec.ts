import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../../shared/toast/toast.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let toastServiceSpy: jasmine.SpyObj<ToastService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);
    toastServiceSpy = jasmine.createSpyObj('ToastService', ['onShowOk', 'onShowError']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent, ReactiveFormsModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: ToastService, useValue: toastServiceSpy },
        { provide: Router, useValue: routerSpy }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve exibir erro se o formulário for inválido', () => {
    component.form.setValue({ login: '', password: '' });
    component.onSubmit();
    expect(authServiceSpy.login).not.toHaveBeenCalled();
  });

  it('deve logar com sucesso e redirecionar', fakeAsync(() => {
    const mockResponse = {
      statusCode: 200,
      message: 'Login realizado com sucesso',
      data: { accessToken: 'fake-token' }
    };

    authServiceSpy.login.and.returnValue(of(mockResponse));

    component.form.setValue({ login: 'usuario', password: 'senha123' });

    component.onSubmit();
    tick();

    expect(authServiceSpy.login).toHaveBeenCalledWith({
      login: 'usuario',
      password: 'senha123'
    });
    expect(toastServiceSpy.onShowOk).toHaveBeenCalledWith('Login realizado com sucesso');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/home']);
  }));

  it('deve exibir erro se login falhar', fakeAsync(() => {
    const mockError = {
      error: { message: 'Credenciais inválidas' }
    };

    authServiceSpy.login.and.returnValue(throwError(() => mockError));

    component.form.setValue({ login: 'usuario', password: 'senhaerrada' });

    component.onSubmit();
    tick();

    expect(authServiceSpy.login).toHaveBeenCalled();
    expect(toastServiceSpy.onShowError).toHaveBeenCalledWith('Credenciais inválidas');
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  }));
});
