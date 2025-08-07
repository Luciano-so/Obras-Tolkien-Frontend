import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthenticateDto } from '../models/authenticate.dto';
import { LoginResponse } from '../models/login-response';
import { jwtDecode } from 'jwt-decode';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);

    sessionStorage.clear();
    (service as any).decodeToken = (token: string) => jwtDecode(token);
  });

  afterEach(() => {
    httpMock.verify();
    sessionStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should store token in sessionStorage on login', () => {
    const mockDto: AuthenticateDto = { login: 'user', password: 'pass' };
    const mockResponse: LoginResponse = {
      statusCode: 200,
      message: 'Success',
      data: { accessToken: 'fake.jwt.token' }
    };

    service.login(mockDto).subscribe(response => {
      expect(response).toEqual(mockResponse);
      expect(sessionStorage.getItem('token')).toBe('fake.jwt.token');
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/Authenticate`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockDto);

    req.flush(mockResponse);
  });

  it('should clear sessionStorage on logout', () => {
    sessionStorage.setItem('token', 'some-token');
    service.logout();
    expect(sessionStorage.getItem('token')).toBeNull();
  });

  it('should decode token and return user info from getUserInfo', () => {
    const fakeTokenPayload = {
      version: '1.0',
      userId: '123',
      userName: 'testuser',
      nbf: 0,
      exp: 9999999999,
      iat: 0
    };

    const fakeToken = 'fake.jwt.token';
    sessionStorage.setItem('token', fakeToken);
    (service as any).decodeToken = (token: string) => fakeTokenPayload;
    const userInfo = service.getUserInfo();
    expect(userInfo).toEqual(fakeTokenPayload);
  });

  it('should return null from getUserInfo if no token', () => {
    expect(service.getUserInfo()).toBeNull();
  });

  it('should return null and handle error if token is invalid in getUserInfo', () => {
    sessionStorage.setItem('token', 'invalid.token');

    spyOn(console, 'error');
    spyOn(service as any, 'decodeToken').and.throwError('Invalid token');

    const result = service.getUserInfo();

    expect(result).toBeNull();
    expect(console.error).toHaveBeenCalled();
  });
});
