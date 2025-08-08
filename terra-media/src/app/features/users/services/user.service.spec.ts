import { TestBed } from '@angular/core/testing';
import { UserService } from './user.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/api-response';
import { UserDto } from '../models/user.dto';
import { CreateUserDto } from '../models/create-user.dto';
import { UpdatePasswordDto } from '../models/update-password.dto';
import { UpdateStatusUserDto } from '../models/update-status-user.dto';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiBaseUrl}/authenticate`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService],
    });

    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verifica se não há requisições pendentes
  });

  it('deve obter todos os usuários (getAll)', () => {
    const mockResponse: ApiResponse<UserDto[]> = {
      statusCode: 200,
      message: 'Success',
      data: [
        { id: '1', name: 'User 1', login: 'user1', active: true, createdAt: '2023-01-01' },
        { id: '2', name: 'User 2', login: 'user2', active: false, createdAt: '2023-02-01' }
      ]
    };

    service.getAll().subscribe(res => {
      expect(res).toEqual(mockResponse);
      expect(res.data.length).toBe(2);
      expect(res.data[0].name).toBe('User 1');
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('deve criar um usuário (create)', () => {
    const dto: CreateUserDto = { name: 'New User', login: 'newuser', password: '123456' };
    const mockResponse: ApiResponse<void> = {
      statusCode: 201,
      message: 'Created',
      data: undefined
    };

    service.create(dto).subscribe(res => {
      expect(res.statusCode).toBe(201);
      expect(res.message).toBe('Created');
    });

    const req = httpMock.expectOne(`${apiUrl}/Create`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(dto);
    req.flush(mockResponse);
  });

  it('deve atualizar a senha do usuário (updatePassword)', () => {
    const dto: UpdatePasswordDto = { id: '1', password: 'newpassword' };
    const mockResponse: ApiResponse<void> = {
      statusCode: 200,
      message: 'Password updated',
      data: undefined
    };

    service.updatePassword(dto).subscribe(res => {
      expect(res.statusCode).toBe(200);
      expect(res.message).toBe('Password updated');
    });

    const req = httpMock.expectOne(`${apiUrl}/Password`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual(dto);
    req.flush(mockResponse);
  });

  it('deve atualizar o status do usuário (updateStatus)', () => {
    const dto: UpdateStatusUserDto = { id: '1', status: true };
    const mockResponse: ApiResponse<void> = {
      statusCode: 200,
      message: 'Status updated',
      data: undefined
    };

    service.updateStatus(dto).subscribe(res => {
      expect(res.statusCode).toBe(200);
      expect(res.message).toBe('Status updated');
    });

    const req = httpMock.expectOne(`${apiUrl}/Status`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual(dto);
    req.flush(mockResponse);
  });
});
