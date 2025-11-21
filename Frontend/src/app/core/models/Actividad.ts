export interface Actividad {
  id: number;
  nombre: string;
  descripcion: string;
  fecha: string;
  ubicacion: string;
  nivel: string;
  numPersInscritas: number;
  numPersTotales: string;
  estado: string;
  precio: string;
  usuarioCreadorNombre: string;
  deporte: string;
  imagen?: string;
}
