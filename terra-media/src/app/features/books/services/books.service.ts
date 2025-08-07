import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/api-response';
import { OpenLibrarySearchResult } from '../models/open-library-search-result';

@Injectable({
  providedIn: 'root',
})
export class BooksService {
  private readonly apiUrl = `${environment.apiBaseUrl}/OpenLibrary`;
  private http = inject(HttpClient);

  searchBooks(author?: string, page: number = 1, limit: number = 10): Observable<OpenLibrarySearchResult> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    if (author) params = params.set('author', author);

    return this.http.get<ApiResponse<OpenLibrarySearchResult>>(`${this.apiUrl}/search`, { params })
      .pipe(map(response => response.data ?? null));
  }

  getAuthorBio(authorKey: string): Observable<AuthorBioResponse | null> {
    return this.http.get<ApiResponse<AuthorBioResponse>>(`${this.apiUrl}/${authorKey}/bio`)
      .pipe(map(response => response.data ?? null));
  }
}
