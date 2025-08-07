import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SideMenuComponent } from './side-menu.component';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from '../../auth/services/auth.service';
import { ToastService } from '../toast/toast.service';
import { By } from '@angular/platform-browser';

describe('SideMenuComponent', () => {
  let component: SideMenuComponent;
  let fixture: ComponentFixture<SideMenuComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let toastServiceSpy: jasmine.SpyObj<ToastService>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getUserInfo', 'logout']);
    toastServiceSpy = jasmine.createSpyObj('ToastService', ['onShowOk']);

    await TestBed.configureTestingModule({
      imports: [SideMenuComponent, RouterTestingModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: ToastService, useValue: toastServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SideMenuComponent);
    component = fixture.componentInstance;
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve carregar informações do usuário no ngOnInit', () => {
    const mockUser = { userName: 'João', version: '2.0.1', userId: '3fa85f64-5717-4562-b3fc-2c963f66afa6' };
    authServiceSpy.getUserInfo.and.returnValue(mockUser);

    component.ngOnInit();

    expect(component.userName()).toBe('João');
    expect(component.version()).toBe('2.0.1');
    expect(component.userSubtitle()).toBe('Autenticado');
  });

  it('deve alternar o menu colapsado', () => {
    expect(component.isCollapsed()).toBeFalse();

    component.toggleMenu();
    expect(component.isCollapsed()).toBeTrue();

    component.toggleMenu();
    expect(component.isCollapsed()).toBeFalse();
  });

  it('deve chamar logout e redirecionar ao clicar em "Sair"', () => {
    spyOn(component['router'], 'navigate');

    component.onLogout();

    expect(toastServiceSpy.onShowOk).toHaveBeenCalledWith('Logout realizado com sucesso.');
    expect(authServiceSpy.logout).toHaveBeenCalled();
    expect(component['router'].navigate).toHaveBeenCalledWith(['/login']);
  });

  it('deve renderizar o logo e nome do usuário quando não colapsado', () => {
    component.isCollapsed.set(false);
    component.userName.set('Maria');
    fixture.detectChanges();

    const logo = fixture.debugElement.query(By.css('.logo'));
    const userName = fixture.debugElement.query(By.css('.user-name'));

    expect(logo).toBeTruthy();
    expect(userName.nativeElement.textContent).toContain('Maria');
  });

  it('não deve renderizar logo e nome do usuário quando colapsado', () => {
    component.isCollapsed.set(true);
    fixture.detectChanges();

    const logo = fixture.debugElement.query(By.css('.logo'));
    const userName = fixture.debugElement.query(By.css('.user-name'));

    expect(logo).toBeFalsy();
    expect(userName).toBeFalsy();
  });
});
