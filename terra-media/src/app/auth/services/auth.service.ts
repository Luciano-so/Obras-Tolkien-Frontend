
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthenticateDto } from '../models/authenticate.dto';
import { environment } from '../../../environments/environment';
import { LoginResponse } from '../models/login-response';
import { jwtDecode, JwtPayload } from 'jwt-decode';

interface TokenPayload {
  version: string;
  userId: string;
  userName: string;
  nbf: number;
  exp: number;
  iat: number;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = `${environment.apiBaseUrl}/authenticate`;
  private http = inject(HttpClient);

  login(dto: AuthenticateDto): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/Authenticate`, dto).pipe(
      tap(response => { sessionStorage.setItem('token', response.data.accessToken); })
    );
  }

  logout(): void {
    sessionStorage.clear();
  }

  getUserInfo(): TokenPayload | null {
    const token = sessionStorage.getItem('token');

    if (!token) return null;

    try {
      return jwtDecode<TokenPayload>(token);
    } catch (err) {
      console.error('Erro ao decodificar o token', err);
      return null;
    }
  }

}
