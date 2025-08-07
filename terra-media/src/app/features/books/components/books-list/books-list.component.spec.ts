import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { BooksListComponent } from './books-list.component';
import { OpenLibraryService } from '../../services/open-library.service';
import { of } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('BooksListComponent', () => {
  let component: BooksListComponent;
  let fixture: ComponentFixture<BooksListComponent>;
  let openLibraryServiceSpy: jasmine.SpyObj<OpenLibraryService>;

  const mockBooksResponse = {
    docs: [
      { title: 'O Senhor dos Anéis', authors: 'J.R.R. Tolkien', first_publish_year: 1954 },
      { title: 'O Hobbit', authors: 'J.R.R. Tolkien', first_publish_year: 1937 }
    ],
    numFound: 2,
    start: 0
  };

  beforeEach(async () => {
    openLibraryServiceSpy = jasmine.createSpyObj('OpenLibraryService', ['searchBooks']);

    await TestBed.configureTestingModule({
      imports: [BooksListComponent, ReactiveFormsModule, NoopAnimationsModule],
      providers: [
        { provide: OpenLibraryService, useValue: openLibraryServiceSpy },
        { provide: MatDialog, useValue: jasmine.createSpyObj('MatDialog', ['open']) }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(BooksListComponent);
    component = fixture.componentInstance;

    openLibraryServiceSpy.searchBooks.and.returnValue(of(mockBooksResponse));
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve carregar livros ao iniciar', () => {
    expect(openLibraryServiceSpy.searchBooks).toHaveBeenCalledWith('Tolkien', 1, 10);
    expect(component.dataSource.data.length).toBe(2);
    expect(component.totalItems).toBe(2);
  });

  it('deve atualizar livros ao mudar o valor da busca', fakeAsync(() => {
    component.form.get('search')?.setValue('Senhor dos Anéis');
    tick(500);
    fixture.detectChanges();

    expect(openLibraryServiceSpy.searchBooks).toHaveBeenCalledWith('Senhor dos Anéis', 1, 10);
  }));

  it('deve carregar livros ao mudar de página', () => {
    component.onPageChange({ pageIndex: 1, pageSize: 10, length: 20 });
    expect(component.currentPage).toBe(2);
    expect(openLibraryServiceSpy.searchBooks).toHaveBeenCalledWith('Tolkien', 2, 10);
  });
});
