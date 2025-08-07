import { TestBed } from '@angular/core/testing';
import { ConfirmDialogService } from './confirm-dialog.service';
import { MatDialog } from '@angular/material/dialog';

describe('ConfirmDialogService', () => {
  let service: ConfirmDialogService;
  let dialogSpy: jasmine.SpyObj<MatDialog>;

  beforeEach(() => {
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    TestBed.configureTestingModule({
      providers: [
        ConfirmDialogService,
        { provide: MatDialog, useValue: dialogSpy }
      ]
    });
    service = TestBed.inject(ConfirmDialogService);
  });

  it('deve ser criado', () => {
    expect(service).toBeTruthy();
  });

  it('deve abrir o dialog', () => {
    dialogSpy.open.and.returnValue({ afterClosed: () => ({ subscribe: () => {} }) } as any);
    service.openConfirm({ message: 'Teste' });
    expect(dialogSpy.open).toHaveBeenCalled();
  });
});
