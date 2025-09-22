import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PruebaPrimeNGComponent } from "./features/pruebaPrimeNG/pruebaPrimeNG/pruebaPrimeNG.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, PruebaPrimeNGComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('Frontend');

  
}
