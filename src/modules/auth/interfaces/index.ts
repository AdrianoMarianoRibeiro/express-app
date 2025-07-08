export interface LoginResponse {
  accessToken: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export interface TokenPayload {
  sub: string;
  email: string;
  name: string;
  jti: string; // Token ID único
  iat?: number;
  exp?: number;
}

export type RefreshTokenPayload = Partial<TokenPayload>;
