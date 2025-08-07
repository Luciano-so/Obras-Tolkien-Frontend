import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CommentDetailsComponent } from './comment-details.component';
import { BooksService } from '../../services/books.service';
import { ToastService } from '../../../../shared/toast/toast.service';
import { ConfirmDialogService } from '../../../../shared/confirm-dialog/confirm-dialog.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { MatErrorMessagesDirective } from '../../../../shared/directives/matErrorMessagesDirective';

describe('CommentDetailsComponent', () => {
  let component: CommentDetailsComponent;
  let fixture: ComponentFixture<CommentDetailsComponent>;

  let booksServiceSpy: jasmine.SpyObj<BooksService>;
  let toastServiceSpy: jasmine.SpyObj<ToastService>;
  let confirmDialogSpy: jasmine.SpyObj<ConfirmDialogService>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<CommentDetailsComponent>>;

  const mockComment = {
    comment: 'Texto do comentário',
    user: 'Usuário Teste',
    updatedAt: new Date(),
    bookId: '1',
    id: '123'
  };

  beforeEach(async () => {
    booksServiceSpy = jasmine.createSpyObj('BooksService', ['updateComment', 'removeComment']);
    toastServiceSpy = jasmine.createSpyObj('ToastService', ['onShowError', 'onShowOk']);
    confirmDialogSpy = jasmine.createSpyObj('ConfirmDialogService', ['openConfirm']);
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [CommentDetailsComponent, ReactiveFormsModule, MatErrorMessagesDirective],
      providers: [
        { provide: BooksService, useValue: booksServiceSpy },
        { provide: ToastService, useValue: toastServiceSpy },
        { provide: ConfirmDialogService, useValue: confirmDialogSpy },
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: { comment: mockComment } }
      ]
    }).compileComponents();


    fixture = TestBed.createComponent(CommentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and initialize form with comment data', () => {
    expect(component).toBeTruthy();
    expect(component.form.value.comment).toBe(mockComment.comment);
  });

  it('should show error if trying to edit with invalid form', () => {
    component.form.controls['comment'].setValue('');
    component.edit();

    expect(toastServiceSpy.onShowError).toHaveBeenCalledWith('O comentário não pode estar vazio.');
    expect(booksServiceSpy.updateComment).not.toHaveBeenCalled();
  });

  it('should call updateComment and close modal on successful edit', fakeAsync(() => {
    booksServiceSpy.updateComment.and.returnValue(of({}));

    component.form.controls['comment'].setValue('Comentário atualizado');
    component.edit();
    tick();

    expect(booksServiceSpy.updateComment).toHaveBeenCalledWith(
      mockComment.bookId,
      mockComment.id,
      { comment: 'Comentário atualizado' }
    );
    expect(toastServiceSpy.onShowOk).toHaveBeenCalledWith('Comentário atualizado com sucesso.');
    expect(dialogRefSpy.close).toHaveBeenCalledWith(true);
  }));

  it('should show error toast on edit failure', fakeAsync(() => {
    const errorResponse = { error: { message: 'Erro ao atualizar comentário' } };
    booksServiceSpy.updateComment.and.returnValue(throwError(() => errorResponse));

    component.form.controls['comment'].setValue('Comentário atualizado');
    component.edit();
    tick();

    expect(toastServiceSpy.onShowError).toHaveBeenCalledWith('Erro ao atualizar comentário');
    expect(dialogRefSpy.close).not.toHaveBeenCalled();
  }));

  it('should open confirm dialog and call removeComment on confirm', fakeAsync(() => {
    confirmDialogSpy.openConfirm.and.returnValue(of(true));
    booksServiceSpy.removeComment.and.returnValue(of({}));

    component.delete();
    tick();

    expect(confirmDialogSpy.openConfirm).toHaveBeenCalled();
    expect(booksServiceSpy.removeComment).toHaveBeenCalledWith(mockComment.bookId, mockComment.id);
    expect(toastServiceSpy.onShowOk).toHaveBeenCalledWith('Comentário removido com sucesso.');
    expect(dialogRefSpy.close).toHaveBeenCalledWith(true);
  }));

  it('should open confirm dialog and NOT call removeComment if cancelled', fakeAsync(() => {
    confirmDialogSpy.openConfirm.and.returnValue(of(false));

    component.delete();
    tick();

    expect(confirmDialogSpy.openConfirm).toHaveBeenCalled();
    expect(booksServiceSpy.removeComment).not.toHaveBeenCalled();
    expect(dialogRefSpy.close).not.toHaveBeenCalled();
  }));

  it('should show error toast if removeComment fails', fakeAsync(() => {
    confirmDialogSpy.openConfirm.and.returnValue(of(true));
    const errorResponse = { error: { message: 'Erro ao remover comentário' } };
    booksServiceSpy.removeComment.and.returnValue(throwError(() => errorResponse));

    component.delete();
    tick();

    expect(toastServiceSpy.onShowError).toHaveBeenCalledWith('Erro ao remover comentário');
    expect(dialogRefSpy.close).not.toHaveBeenCalled();
  }));

  it('should close dialog when close is called', () => {
    component.close(true);
    expect(dialogRefSpy.close).toHaveBeenCalledWith(true);
  });
});
