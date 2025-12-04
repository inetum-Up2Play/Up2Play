export interface Perfil {
  id: number;
  nombre: string;
  apellido: string;
  imagen?: number;
  telefono: number;
  sexo: string;
  fecha_nac: Date;
  idiomas: string;
  id_usuario: number;

}
