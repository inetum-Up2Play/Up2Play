import { Component, input } from '@angular/core';
import { Usuario } from '../../../../shared/models/usuario.model';

@Component({
  selector: 'app-avatar-profile',
  imports: [],
  templateUrl: './avatar-profile.html',
  styleUrl: './avatar-profile.scss'
})
export class AvatarProfile {

    usuario = input<Usuario | null>(null);


}
