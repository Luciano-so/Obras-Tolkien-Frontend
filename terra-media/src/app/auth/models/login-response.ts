export interface LoginResponse {
  data: {
    accessToken: string;
  },
  message: string;
  statusCode: number;
}
