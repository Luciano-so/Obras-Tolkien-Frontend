import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { BookCommentsComponent } from './book-comments.component';
import { BooksService } from '../../services/books.service';
import { ToastService } from '../../../../shared/toast/toast.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { of, throwError } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('BookCommentsComponent', () => {
  let component: BookCommentsComponent;
  let fixture: ComponentFixture<BookCommentsComponent>;

  let mockBooksService: jasmine.SpyObj<BooksService>;
  let mockToastService: jasmine.SpyObj<ToastService>;
  let mockMatDialog: jasmine.SpyObj<MatDialog>;

  beforeEach(waitForAsync(() => {
    mockBooksService = jasmine.createSpyObj('BooksService', ['getBookByCoverId', 'createOrAddComment']);
    mockToastService = jasmine.createSpyObj('ToastService', ['onShowOk', 'onShowError']);
    mockMatDialog = jasmine.createSpyObj('MatDialog', ['open']);

    mockBooksService.getBookByCoverId.and.returnValue(of({ id: 1, comments: [] }));

    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        BookCommentsComponent
      ],
      providers: [
        { provide: BooksService, useValue: mockBooksService },
        { provide: ToastService, useValue: mockToastService },
        { provide: MatDialog, useValue: mockMatDialog }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookCommentsComponent);
    component = fixture.componentInstance;
    component.book = { cover_i: 123 } as any;
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve carregar comentários no ngOnInit e setar comments e bookId', fakeAsync(() => {
    const fakeResponse = { id: 1, comments: [{ user: 'User1', comment: 'text', updatedAt: new Date() }] };
    mockBooksService.getBookByCoverId.and.returnValue(of(fakeResponse));

    fixture.detectChanges();
    tick();

    expect(mockBooksService.getBookByCoverId).toHaveBeenCalledWith(123);
    const bookIdValue = component.commentForm.get('bookId')?.value as unknown as number;
    expect(bookIdValue).toBe(1);
    expect(component.comments.length).toBe(1);
  }));

  it('loadBook não deve chamar getBookByCoverId se cover_i for undefined', () => {
    component.book.cover_i = undefined as any;
    component.loadBook();
    expect(mockBooksService.getBookByCoverId).not.toHaveBeenCalled();
  });

  it('loadBook deve limpar comments em caso de erro', fakeAsync(() => {
    mockBooksService.getBookByCoverId.and.returnValue(throwError(() => new Error('Erro')));
    fixture.detectChanges();
    tick();
    expect(component.comments).toEqual([]);
  }));

  it('submitComment não deve enviar se form inválido', () => {
    component.commentForm.get('comment')?.setValue('');
    component.submitComment();
    expect(mockBooksService.createOrAddComment).not.toHaveBeenCalled();
  });

  it('submitComment deve enviar comentário e recarregar lista em caso de sucesso', fakeAsync(() => {
    component.commentForm.get('comment')?.setValue('Comentário válido');
    component.commentForm.get('bookId')?.setValue(1 as unknown as null);

    mockBooksService.createOrAddComment.and.returnValue(of({}));
    spyOn(component, 'loadBook');

    component.submitComment();
    tick();
    fixture.detectChanges();

    expect(mockBooksService.createOrAddComment).toHaveBeenCalledWith(123, 1 as unknown as null, { comment: 'Comentário válido' });
    expect(mockToastService.onShowOk).toHaveBeenCalledWith('Comentário adicionado com sucesso.');
    expect(component.commentForm.get('comment')?.value).toBe('');
    expect(component.loadBook).toHaveBeenCalled();
  }));

  it('submitComment deve mostrar erro caso serviço retorne erro', fakeAsync(() => {
    component.commentForm.get('comment')?.setValue('Comentário válido');
    component.commentForm.get('bookId')?.setValue(1 as unknown as null);

    const errorResponse = { error: { message: 'Erro personalizado' } };
    mockBooksService.createOrAddComment.and.returnValue(throwError(() => errorResponse));

    component.submitComment();
    tick();
    fixture.detectChanges();

    expect(mockToastService.onShowError).toHaveBeenCalledWith('Erro personalizado');
  }));

  it('openCommentDetails deve abrir dialog e recarregar comentários se resultado for true', fakeAsync(() => {
    const dialogRefSpyObj = {
      afterClosed: () => of(true)
    };
    mockMatDialog.open.and.returnValue(dialogRefSpyObj as MatDialogRef<any>);

    spyOn(component, 'loadBook');

    const comment = { comment: 'text' };
    component.openCommentDetails(comment);
    tick();
    fixture.detectChanges();

    expect(mockMatDialog.open).toHaveBeenCalled();
    expect(component.loadBook).toHaveBeenCalled();
  }));

  it('deve carregar comentários no ngOnInit e setar comments e bookId', fakeAsync(() => {
    const fakeResponse = { id: 1, comments: [{ user: 'User1', comment: 'text', updatedAt: new Date() }] };
    mockBooksService.getBookByCoverId.and.returnValue(of(fakeResponse));

    component.ngOnInit();
    tick();
    fixture.detectChanges();

    expect(mockBooksService.getBookByCoverId).toHaveBeenCalledWith(123);
    const bookIdValue = component.commentForm.get('bookId')?.value as unknown as number;
    expect(bookIdValue).toBe(1);
    expect(component.comments.length).toBe(1);
  }));
});
