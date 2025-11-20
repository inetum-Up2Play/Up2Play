export interface Actividad {
    id: number;
    titulo: string;
    descripcion: string;
    fecha: string;
    hora: string;
    ubicacion: string;
    nivel: string;
    num_pers_inscritas: string;
    num_pers_totales: string;
    estado: string;
    precio: string;
    id_usuario_creador: string;
    deporte: string;
    imagen?: string;
}