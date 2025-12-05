import { Component, input, output } from '@angular/core';
import { Usuario } from '../../../../shared/models/usuario.model';
import { Perfil } from '../../../../shared/models/Perfil';
import { Profile } from '../../pages/profile/profile';

@Component({
  selector: 'app-form-profile',
  imports: [],
  templateUrl: './form-profile.html',
  styleUrl: './form-profile.scss'
})
export class FormProfile {

  // Recibe datos del padre
  usuario = input<Usuario | null>(null);
  perfil  = input<Perfil  | null>(null);

  // Envia dades al pare
  cambiosPerfil  = output<Perfil>();

  // Has de posar tots els camps al perfil al nouPerfil, el id, es posa el mateix que hi havia
  //   id: number;
  // nombre: string;
  // apellido: string;
  // imagen?: number;
  // telefono: number;
  // sexo: string;
  // fecha_nac: Date;
  // idiomas: string;
  // id_usuario: number;
  
/*
  enviarPerfil(formValues: any) {
    const nuevoPerfil: Perfil = {
      id: this.usuario()?.id ?? 0, // o lo que corresponda
      nombre: formValues.nombre,
      contraseña: formValues.contraseña,
      rol: formValues.rol,
      nombre_usuario: formValues.nombre_usuario,
    };


    this.cambiosPerfil.emit(nuevoPerfil);
  }
    */





}
