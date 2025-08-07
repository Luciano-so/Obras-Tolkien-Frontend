import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AuthorsModalComponent } from './author-modal.component';
import { OpenLibraryService } from '../../services/open-library.service';
import { of } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('AuthorsModalComponent', () => {
  let component: AuthorsModalComponent;
  let fixture: ComponentFixture<AuthorsModalComponent>;
  let mockOpenLibraryService: any;
  let mockDialogRef: any;

  beforeEach(waitForAsync(() => {
    mockOpenLibraryService = {
      getAuthorBio: jasmine.createSpy('getAuthorBio').and.callFake((authorId: string) => {
        return of({ name: `Author ${authorId}`, bio: `Bio for author ${authorId} ([Source][1]) [1]: http://source.com/${authorId}` });
      })
    };

    mockDialogRef = {
      close: jasmine.createSpy('close')
    };

    TestBed.configureTestingModule({
      imports: [AuthorsModalComponent],
      providers: [
        { provide: OpenLibraryService, useValue: mockOpenLibraryService },
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: ['123', '456'] }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthorsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve carregar autores no ngOnInit', () => {
    fixture.whenStable().then(() => {
      expect(component.authors.length).toBe(2);
      expect(component.authors[0].name).toBe('Author 123');
      expect(component.authors[1].name).toBe('Author 456');
    });
  });

  it('authorsTitle deve retornar título correto', () => {
    component.authors = [];
    expect(component.authorsTitle).toBe('Propriedades dos autores');

    component.authors = [{ name: 'Autor único' }];
    expect(component.authorsTitle).toBe('Propriedade do autor');

    component.authors = [{}, {}, {}];
    expect(component.authorsTitle).toBe('Propriedades dos autores');
  });

  it('cleanBio deve limpar bio e adicionar fonte', () => {
    const rawBio = "Some bio text ([Source][1]) [1]: http://link.com";
    const cleaned = component.cleanBio(rawBio);
    expect(cleaned).toContain('Some bio text');
    expect(cleaned).toContain('Fonte: <a href="http://link.com" target="_blank">http://link.com</a>');
  });

  it('cleanBio deve retornar string vazia se bio for nula ou indefinida', () => {
    expect(component.cleanBio(null as any)).toBe('');
    expect(component.cleanBio(undefined as any)).toBe('');
  });

  it('closeModal deve chamar dialogRef.close', () => {
    component.closeModal();
    expect(mockDialogRef.close).toHaveBeenCalled();
  });
});
