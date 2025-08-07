import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/api-response';

@Injectable({
  providedIn: 'root',
})
export class BooksService {
  private readonly apiUrl = `${environment.apiBaseUrl}/Books`;
  private http = inject(HttpClient);

  getBookByCoverId(coverId: number): Observable<any | null> {
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/${coverId}`)
      .pipe(map(response => response.data ?? null));
  }

  private createBookWithComment(coverId: number, commentDto: { comment: string }) {
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/create-with-comment/${coverId}`, commentDto)
      .pipe(map(response => response.data));
  }

  private addComment(bookId: string, commentDto: { comment: string }) {
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/${bookId}/add-comment`, commentDto)
      .pipe(map(response => response.data));
  }

  createOrAddComment(coverId: number, bookId: string | null, commentDto: { comment: string }) {
    if (bookId) {
      return this.addComment(bookId, commentDto);
    } else {
      return this.createBookWithComment(coverId, commentDto);
    }
  }

  updateComment(bookId: string, commentId: string, commentDto: { comment: string }) {
    return this.http.put<ApiResponse<any>>(`${this.apiUrl}/${bookId}/update-comment/${commentId}`, commentDto)
      .pipe(map(response => response.data));
  }

  removeComment(bookId: string, commentId: string) {
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/${bookId}/remove-comment/${commentId}`)
      .pipe(map(response => response.data));
  }
}
