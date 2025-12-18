import { Actividad } from './Actividad'; 
import { Usuario } from './usuario.model';   
export interface Notificacion {
    id: number;
    titulo: string;
    descripcion: string;
    fecha: string; //'YYYY-MM-DD'
    leido: boolean;
    // Enum del backend mapeado a string literals para mayor seguridad
    estadoNotificacion: 'INSCRITO' | 'PAGADO' | 'ACTUALIZADO' | 'DESAPUNTADO' | 'CANCELADA' | 'CREADA' | 'EDITADA';
    
    // Relaciones (opcionales por si el backend manda null en alguna)
    actividad?: Actividad;
    usuarios?: Usuario;
    usuarioCreador?: Usuario;
}