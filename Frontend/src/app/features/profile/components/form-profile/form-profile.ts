import { Component, input } from '@angular/core';
import { Usuario } from '../../../../shared/models/usuario.model';

@Component({
  selector: 'app-form-profile',
  imports: [],
  templateUrl: './form-profile.html',
  styleUrl: './form-profile.scss'
})
export class FormProfile {

  
  usuario = input<Usuario | null>(null);



}
