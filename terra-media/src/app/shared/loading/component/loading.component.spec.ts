import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoadingComponent } from './loading.component';
import { LoadingService } from '../service/loading.service';
import { BehaviorSubject } from 'rxjs';
import { By } from '@angular/platform-browser';

describe('LoadingComponent', () => {
  let component: LoadingComponent;
  let fixture: ComponentFixture<LoadingComponent>;
  let mockLoadingService: jasmine.SpyObj<LoadingService>;
  let loadingState$: BehaviorSubject<boolean>;

  beforeEach(async () => {
    loadingState$ = new BehaviorSubject<boolean>(false);

    mockLoadingService = jasmine.createSpyObj('LoadingService', ['show', 'hide', 'close', 'forceHide'], {
      state$: loadingState$.asObservable()
    });

    await TestBed.configureTestingModule({
      imports: [LoadingComponent],
      providers: [
        { provide: LoadingService, useValue: mockLoadingService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve ser criado', () => {
    expect(component).toBeTruthy();
  });

  it('deve exibir o loading quando show for true', () => {
    loadingState$.next(true);
    fixture.detectChanges();

    const loaderElement = fixture.debugElement.query(By.css('.page-preloading'));
    expect(loaderElement).toBeTruthy();
  });

  it('não deve exibir o loading quando show for false', () => {
    loadingState$.next(false);
    fixture.detectChanges();

    const loaderElement = fixture.debugElement.query(By.css('.page-preloading'));
    expect(loaderElement).toBeFalsy();
  });
});
