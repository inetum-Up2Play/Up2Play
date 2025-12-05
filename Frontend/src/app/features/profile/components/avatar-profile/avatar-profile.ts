import { Component, input, output } from '@angular/core';
import { Usuario } from '../../../../shared/models/usuario.model';
import { Perfil } from '../../../../shared/models/Perfil';

@Component({
  selector: 'app-avatar-profile',
  imports: [],
  templateUrl: './avatar-profile.html',
  styleUrl: './avatar-profile.scss'
})
export class AvatarProfile {

  // Recibe datos del padre
  usuario = input<Usuario | null>(null);
  perfil = input<Perfil | null>(null);

  // Envia dades al pare
  cambiosAvatar  = output<number>();

  // Ver si se ha modificado el avatar y llamar a cambiosAvatar
  if () {
    
  }


}
