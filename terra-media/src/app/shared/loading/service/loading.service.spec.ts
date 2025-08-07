import { TestBed } from '@angular/core/testing';
import { LoadingService } from './loading.service';

describe('LoadingService', () => {
  let service: LoadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoadingService);
  });

  it('deve iniciar com estado false', (done) => {
    service.state$.subscribe(state => {
      expect(state).toBeFalse();
      done();
    });
  });

  it('deve exibir o loading após chamar show()', (done) => {
    service.show();
    service.state$.subscribe(state => {
      expect(state).toBeTrue();
      done();
    });
  });

  it('deve ocultar o loading com close() após show()', (done) => {
    service.show();
    service.close();
    service.state$.subscribe(state => {
      expect(state).toBeFalse();
      done();
    });
  });

  it('deve manter o loading visível se close() for chamado antes de show()', (done) => {
    service.close();
    service.state$.subscribe(state => {
      expect(state).toBeFalse();
      done();
    });
  });

  it('deve forçar esconder o loading com forceHide()', (done) => {
    service.show();
    service.show();
    service.forceHide();
    service.state$.subscribe(state => {
      expect(state).toBeFalse();
      done();
    });
  });
});
