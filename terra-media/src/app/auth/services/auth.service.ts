import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticateDto } from '../models/authenticate.dto';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = `${environment.apiBaseUrl}/authenticate`;
  private http = inject(HttpClient);

  login(dto: AuthenticateDto): Observable<any> {
    return this.http.post(`${this.apiUrl}/Authenticate`, dto);
  }
}
