import { Component } from '@angular/core';
import { PruebaPrimeNGComponent } from './pruebaPrimeNG/pruebaPrimeNG.component';
import { Header } from '../../core/layout/header/header';
import { InfoActividad } from "../actividades/pages/info-actividad/info-actividad";

@Component({
  selector: 'app-home',
  imports: [PruebaPrimeNGComponent, Header, InfoActividad],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {

}
