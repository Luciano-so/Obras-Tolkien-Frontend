import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BookModalComponent } from './book-modal.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { OpenLibraryBook } from '../../models/open-library-book';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('BookModalComponent', () => {
  let component: BookModalComponent;
  let fixture: ComponentFixture<BookModalComponent>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<BookModalComponent>>;

  const mockBook: OpenLibraryBook = {
    coverUrl: 'https://example.com/cover.jpg',
    title: 'Mock Book',
    authors: 'Mock Author',
    first_publish_year: 2021
  };

  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [BookModalComponent, HttpClientTestingModule],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: { book: mockBook } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BookModalComponent);
    component = fixture.componentInstance;
    component.commentsComponent = jasmine.createSpyObj('BookCommentsComponent', ['submitComment']);

    fixture.detectChanges();
  });

  it('should create and display book details tab by default', () => {
    expect(component).toBeTruthy();
    expect(component.selectedTab).toBe('details');

    const detailsBtn = fixture.debugElement.query(By.css('nav button.active'));
    expect(detailsBtn.nativeElement.textContent.trim()).toBe('Detalhes');

    const bookDetails = fixture.debugElement.query(By.css('app-book-details'));
    expect(bookDetails).toBeTruthy();

    const bookComments = fixture.debugElement.query(By.css('app-book-comments'));
    expect(bookComments).toBeNull();

    const addCommentBtn = fixture.debugElement.query(By.css('.add-comment-btn'));
    expect(addCommentBtn).toBeNull();
  });

  it('should switch to comments tab and show comments component and add comment button', () => {
    const commentsBtn = fixture.debugElement.queryAll(By.css('nav button'))
      .find(btn => btn.nativeElement.textContent.trim() === 'Comentários');
    commentsBtn?.nativeElement.click();
    fixture.detectChanges();

    expect(component.selectedTab).toBe('comments');

    const activeBtn = fixture.debugElement.query(By.css('nav button.active'));
    expect(activeBtn.nativeElement.textContent.trim()).toBe('Comentários');

    const bookComments = fixture.debugElement.query(By.css('app-book-comments'));
    expect(bookComments).toBeTruthy();

    const bookDetails = fixture.debugElement.query(By.css('app-book-details'));
    expect(bookDetails).toBeNull();

    const addCommentBtn = fixture.debugElement.query(By.css('.add-comment-btn'));
    expect(addCommentBtn).toBeTruthy();
  });

  it('should close modal when close button clicked', () => {
    const closeBtn = fixture.debugElement.query(By.css('.close-btn-bottom'));
    closeBtn.nativeElement.click();
    expect(dialogRefSpy.close).toHaveBeenCalled();
  });

  it('should call submitComment on BookCommentsComponent when clicking add comment button', () => {
    component.selectedTab = 'comments';
    fixture.detectChanges();
    spyOn(component.commentsComponent, 'submitComment');

    const addCommentBtn = fixture.debugElement.query(By.css('.add-comment-btn'));
    addCommentBtn.nativeElement.click();

    expect(component.commentsComponent.submitComment).toHaveBeenCalled();
  });

  it('should not call submitComment if selected tab is not comments', () => {
    component.selectedTab = 'details';
    fixture.detectChanges();

    const addCommentBtn = fixture.debugElement.query(By.css('.add-comment-btn'));
    expect(addCommentBtn).toBeNull();

    if (component.commentsComponent) {
      spyOn(component.commentsComponent, 'submitComment');
    }
    component.onAddComment();
    if (component.commentsComponent) {
      expect(component.commentsComponent.submitComment).not.toHaveBeenCalled();
    }
  });
});
