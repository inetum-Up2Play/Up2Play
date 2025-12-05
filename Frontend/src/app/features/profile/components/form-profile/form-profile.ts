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
  cambiosUsuario = output<Usuario>();
  cambiosPerfil  = output<Perfil>();
  

  


  enviarUsuario(formValues: any) {
    const nuevoUsuario: Usuario = {
      id: this.usuario()?.id ?? 0, // o lo que corresponda
      email: formValues.email,
      contraseña: formValues.contraseña,
      rol: formValues.rol,
      nombre_usuario: formValues.nombre_usuario,
    };

    this.cambiosUsuario.emit(nuevoUsuario);
  }





}
