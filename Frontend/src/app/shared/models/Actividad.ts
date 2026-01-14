export interface Actividad {
  id: number;
  nombre: string;
  descripcion: string;
  fecha: string;
  ubicacion: string;
  nivel: string;
  numPersInscritas: number;
  numPersTotales: number;
  estado: string;
  precio: number;
  usuarioCreadorNombre: string;
  usuarioCreadorId: number;
  deporte: string;
  imagen?: string;
}
