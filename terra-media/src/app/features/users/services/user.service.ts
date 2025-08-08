
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/api-response';
import { UpdateStatusUserDto } from '../models/update-status-user.dto';
import { UpdatePasswordDto } from '../models/update-password.dto';
import { CreateUserDto } from '../models/create-user.dto';
import { UserDto } from '../models/user.dto';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly apiUrl = `${environment.apiBaseUrl}/authenticate`;
  private http = inject(HttpClient);

  getAll(): Observable<ApiResponse<UserDto[]>> {
    return this.http.get<ApiResponse<UserDto[]>>(this.apiUrl);
  }

  create(dto: CreateUserDto): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(`${this.apiUrl}/Create`, dto);
  }

  updatePassword(dto: UpdatePasswordDto): Observable<ApiResponse<void>> {
    return this.http.patch<ApiResponse<void>>(`${this.apiUrl}/Password`, dto);
  }

  updateStatus(dto: UpdateStatusUserDto): Observable<ApiResponse<void>> {
    return this.http.patch<ApiResponse<void>>(`${this.apiUrl}/Status`, dto);
  }
}
