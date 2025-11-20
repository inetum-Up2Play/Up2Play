export interface Actividad {
  id: number;
  nombre: string;
  descripcion: string;
  fecha: string;
  hora: string;
  ubicacion: string;
  nivel: string;
  numPersInscritas: string;
  numPersTotales: string;
  estado: string;
  precio: string;
  usuarioCreadorId: string;
  deporte: string;
  imagen?: string;
}
