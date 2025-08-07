import { TestBed } from '@angular/core/testing';
import { BooksService } from './books.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiResponse } from '../../../core/models/api-response';
import { environment } from '../../../../environments/environment';

describe('BooksService', () => {
  let service: BooksService;
  let httpMock: HttpTestingController;

  const apiUrl = `${environment.apiBaseUrl}/Books`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BooksService]
    });

    service = TestBed.inject(BooksService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getBookByCoverId', () => {
    it('should return book data', () => {
      const mockResponse: ApiResponse<any> = {
        statusCode: 200,
        message: 'Success',
        data: { title: 'The Hobbit', author: 'J.R.R. Tolkien' }
      };

      service.getBookByCoverId(123).subscribe(result => {
        expect(result).toEqual(mockResponse.data);
      });

      const req = httpMock.expectOne(`${apiUrl}/123`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should return null if response.data is null', () => {
      const mockResponse: ApiResponse<any> = {
        statusCode: 200,
        message: 'Success',
        data: null
      };

      service.getBookByCoverId(456).subscribe(result => {
        expect(result).toBeNull();
      });

      const req = httpMock.expectOne(`${apiUrl}/456`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('createOrAddComment', () => {
    it('should call addComment if bookId is provided', () => {
      const mockResponse: ApiResponse<any> = {
        statusCode: 200,
        message: 'Success',
        data: { comment: 'Nice book!' }
      };

      service.createOrAddComment(1, 'abc123', { comment: 'Nice book!' }).subscribe(result => {
        expect(result).toEqual(mockResponse.data);
      });

      const req = httpMock.expectOne(`${apiUrl}/abc123/add-comment`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ comment: 'Nice book!' });
      req.flush(mockResponse);
    });

    it('should call createBookWithComment if bookId is null', () => {
      const mockResponse: ApiResponse<any> = {
        statusCode: 200,
        message: 'Success',
        data: { id: 'newBookId' }
      };

      service.createOrAddComment(42, null, { comment: 'New book comment' }).subscribe(result => {
        expect(result).toEqual(mockResponse.data);
      });

      const req = httpMock.expectOne(`${apiUrl}/create-with-comment/42`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ comment: 'New book comment' });
      req.flush(mockResponse);
    });
  });

  describe('updateComment', () => {
    it('should send PUT request to update comment', () => {
      const mockResponse: ApiResponse<any> = {
        statusCode: 200,
        message: 'Updated',
        data: { comment: 'Updated comment' }
      };

      service.updateComment('book123', 'comment456', { comment: 'Updated comment' }).subscribe(result => {
        expect(result).toEqual(mockResponse.data);
      });

      const req = httpMock.expectOne(`${apiUrl}/book123/update-comment/comment456`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual({ comment: 'Updated comment' });
      req.flush(mockResponse);
    });
  });

  describe('removeComment', () => {
    it('should send DELETE request to remove comment', () => {
      const mockResponse: ApiResponse<any> = {
        statusCode: 200,
        message: 'Removed',
        data: true
      };

      service.removeComment('book123', 'comment456').subscribe(result => {
        expect(result).toBe(true);
      });

      const req = httpMock.expectOne(`${apiUrl}/book123/remove-comment/comment456`);
      expect(req.request.method).toBe('DELETE');
      req.flush(mockResponse);
    });
  });
});
