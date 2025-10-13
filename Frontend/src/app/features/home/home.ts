import { Component } from '@angular/core';
import { PruebaPrimeNGComponent } from './pruebaPrimeNG/pruebaPrimeNG.component';
import { Header } from '../../core/layout/header/header';

@Component({
  selector: 'app-home',
  imports: [PruebaPrimeNGComponent, Header],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {

}
