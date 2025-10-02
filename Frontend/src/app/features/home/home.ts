import { Component } from '@angular/core';
import { PruebaPrimeNGComponent } from './pruebaPrimeNG/pruebaPrimeNG.component';

@Component({
  selector: 'app-home',
  imports: [PruebaPrimeNGComponent],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {

}
