export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  nombre: string;
  apellido: string;
  telefono?: string;
  fecha_nacimiento?: string;
  genero?: 'M' | 'F' | 'Otro';
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    nombre: string;
    apellido: string;
    rol: string;
  };
  token: string;
  refreshToken?: string;
}

export interface RefreshTokenDto {
  refreshToken: string;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}

export interface ResetPasswordDto {
  email: string;
}

export interface ConfirmResetPasswordDto {
  token: string;
  newPassword: string;
}
