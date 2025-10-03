import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UsuarioComponent } from "./features/user/components/usuario/usuario";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, UsuarioComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('Frontend');

  
}
