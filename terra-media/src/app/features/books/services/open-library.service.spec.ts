import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { OpenLibraryService } from './open-library.service';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/api-response';
import { OpenLibrarySearchResult } from '../models/open-library-search-result';

describe('OpenLibraryService', () => {
  let service: OpenLibraryService;
  let httpMock: HttpTestingController;

  const mockSearchResponse: ApiResponse<OpenLibrarySearchResult> = {
    statusCode: 200,
    message: 'Success',
    data: {
      numFound: 1,
      start: 0,
      docs: [
        {
          title: 'O Senhor dos Anéis',
          author_name: ['J.R.R. Tolkien'],
          key: '/works/OL123456W',
          authors: 'J.R.R. Tolkien',
        }
      ]
    }
  };

  const mockBioResponse: ApiResponse<any> = {
    statusCode: 200,
    message: 'Success',
    data: {
      bio: 'John Ronald Reuel Tolkien was an English writer and philologist.'
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [OpenLibraryService],
    });
    service = TestBed.inject(OpenLibraryService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should search books with author, page and limit', () => {
    service.searchBooks('Tolkien', 2, 5).subscribe(result => {
      expect(result).toEqual(mockSearchResponse.data);
    });

    const req = httpMock.expectOne(
      `${environment.apiBaseUrl}/OpenLibrary/search?page=2&limit=5&author=Tolkien`
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockSearchResponse);
  });

  it('should get author bio by authorKey', () => {
    const authorKey = 'OL123456A';
    service.getAuthorBio(authorKey).subscribe(bio => {
      expect(bio).toEqual(mockBioResponse.data);
    });

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/OpenLibrary/${authorKey}/bio`);
    expect(req.request.method).toBe('GET');
    req.flush(mockBioResponse);
  });

  it('should return null if search response has no data', () => {
    const responseWithoutData: ApiResponse<OpenLibrarySearchResult> = {
      statusCode: 200,
      message: 'Success',
      data: null as any
    };

    service.searchBooks('Tolkien').subscribe(result => {
      expect(result).toBeNull();
    });

    const req = httpMock.expectOne(
      `${environment.apiBaseUrl}/OpenLibrary/search?page=1&limit=10&author=Tolkien`
    );
    req.flush(responseWithoutData);
  });

  it('should return null if author bio response has no data', () => {
    const responseWithoutData: ApiResponse<any> = {
      statusCode: 200,
      message: 'Success',
      data: null
    };

    service.getAuthorBio('OL123456A').subscribe(bio => {
      expect(bio).toBeNull();
    });

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/OpenLibrary/OL123456A/bio`);
    req.flush(responseWithoutData);
  });
});
