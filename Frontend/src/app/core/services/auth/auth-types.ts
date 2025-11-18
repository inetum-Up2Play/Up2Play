export interface LoginResponse {
  token: string;
  /** Duración en milisegundos (ej: 3600000 para 1h) */
  expiresIn: number;
}

export interface Credentials {
  email: string;
  password: string;
}