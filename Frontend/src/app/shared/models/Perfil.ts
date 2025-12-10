export interface Perfil {
  fechaNacimiento: any;
  id: number;
  nombre: string;
  apellido: string;
  imagenPerfil?: number;
  telefono: number;
  sexo: string | null;
  idiomas: string;
  id_usuario: number;
}
