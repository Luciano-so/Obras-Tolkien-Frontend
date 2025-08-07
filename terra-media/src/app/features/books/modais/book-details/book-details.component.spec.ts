import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BookDetailsComponent } from './book-details.component';
import { By } from '@angular/platform-browser';

describe('BookDetailsComponent', () => {
  let component: BookDetailsComponent;
  let fixture: ComponentFixture<BookDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookDetailsComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(BookDetailsComponent);
    component = fixture.componentInstance;
  });

  it('should render book details correctly', () => {
    const testBook = {
      coverUrl: 'https://example.com/cover.jpg',
      title: 'Test Book Title',
      authors: 'John Doe',
      first_publish_year: 2000
    };

    component.book = testBook;
    fixture.detectChanges();

    const img = fixture.debugElement.query(By.css('.book-cover')).nativeElement as HTMLImageElement;
    expect(img.src).toContain(testBook.coverUrl);
    expect(img.alt).toBe('Capa do livro');

    const titleEl = fixture.debugElement.query(By.css('.book-title')).nativeElement;
    expect(titleEl.textContent).toBe(testBook.title);

    const authorEl = fixture.debugElement.query(By.css('.book-author')).nativeElement;
    expect(authorEl.textContent).toContain(testBook.authors);

    const pubYearEl = fixture.debugElement.query(By.css('.book-pub')).nativeElement;
    expect(pubYearEl.textContent).toContain('Primeira publicação: 2000');
  });

  it('should display fallback text if first_publish_year is missing', () => {
    const testBook = {
      coverUrl: 'https://example.com/cover.jpg',
      title: 'No Year Book',
      authors: 'Jane Doe'
    };

    component.book = testBook as any;
    fixture.detectChanges();

    const pubYearEl = fixture.debugElement.query(By.css('.book-pub')).nativeElement;
    expect(pubYearEl.textContent).toContain('Primeira publicação: Ano não disponível');
  });
});
