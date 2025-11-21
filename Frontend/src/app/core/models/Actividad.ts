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
  precio: string;
  usuarioCreadorNombre: string;
  usuarioCreadorId: number;
  deporte: string;
  imagen?: string;
}
