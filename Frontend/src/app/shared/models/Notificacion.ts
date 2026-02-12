import { Actividad } from './Actividad';
import { Usuario } from './usuario.model';

export interface Notificacion {
  id: number;
  titulo: string;
  descripcion: string;
  fecha: string; //'YYYY-MM-DD'
  leido: boolean;
  // Enum del backend mapeado a string literals para mayor seguridad
  estadoNotificacion:
    | 'INSCRITO'
    | 'PAGADO'
    | 'ACTUALIZADO'
    | 'DESAPUNTADO'
    | 'CANCELADA'
    | 'CREADA'
    | 'EDITADA'
    | 'REEMBOLSADO'
    | 'PAGO_RECIBIDO'
    | 'PAGO_FALLIDO';

  actividad?: Actividad;
  usuarios?: Usuario;
  usuarioCreador?: Usuario;
}
