import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';


@Injectable({
  providedIn: 'root',

})
export class ErrorService {

  constructor(private messageService: MessageService) { }

  private readonly ERROR_MESSAGES: Record<string, string> = {
    CORREO_REGISTRADO: 'Este correo ya está registrado. Intenta iniciar sesión o usar otro correo.', // 409
    NOMBRE_USUARIO_REGISTRADO: 'El nombre de usuario ya está en uso. Elige otro diferente.', // 409
    USUARIO_NO_ENCONTRADO: 'No se ha encontrado ningún usuario con esos datos.', // 404
    USUARIO_BLOQUEADO_LOGIN: 'Tu cuenta ha sido bloqueada por demasiados intentos fallidos. Inténtalo más tarde.', // 423
    USUARIO_NO_VERIFICADO: 'Tu cuenta no ha sido verificada. Revisa tu correo electrónico.', // 403
    CREDENCIALES_ERRONEAS: 'Las credenciales son incorrectas. Verifica tu email y contraseña.', // 401
    CODIGO_EXPIRADO: 'El código de verificación ha expirado. Solicita uno nuevo.', // 410
    CODIGO_INCORRECTO: 'El código de verificación es incorrecto. Intenta de nuevo.', // 400
    CUENTA_YA_VERIFICADA: 'Tu cuenta ya ha sido verificada. Puedes iniciar sesión.', // 409
    CORREO_NO_COINCIDE: 'No se ha encontrado una cuenta con ese correo.', // 409
    FALTA_TOKEN_O_CORREO: 'Falta el token o el correo en la solicitud. Intenta de nuevo.', // 400
    UNKNOWN: 'Ha ocurrido un error desconocido.' // ?
  };

  getMensajeError(codigo: string | false): string {
    if (!codigo) return 'Ha ocurrido un error desconocido.';

    return this.ERROR_MESSAGES[codigo] ?? `Error inesperado: ${codigo}`;
  }

  showError(detail: string): void {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: detail
    });
  }

}
