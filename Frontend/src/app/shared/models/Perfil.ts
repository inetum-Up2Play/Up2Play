export interface Perfil {
  fechaNacimiento: any;
  id: number;
  nombre: string;
  apellido: string;
  imagen?: number;
  telefono: number;
  sexo: string | null;
  fecha_nac: Date | null;
  idiomas: string;
  id_usuario: number;
}
