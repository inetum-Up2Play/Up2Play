import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-auth-header',
  imports: [RouterModule],
  templateUrl: './auth-header.component.html',
  styleUrl: './auth-header.component.scss'
})

export class AuthHeaderComponent {
  landingUrl = 'http://127.0.0.1:5500/Up2Play/Landing/index.html'
  IniciarSesionUrl = '/auth/login'
  RegistrarseUrl = '/auth/register';

  currentUrl: string = '';

  constructor(private router: Router) {
    this.router.events.subscribe(() => {
      this.currentUrl = this.router.url;
    });
  }

  isLogin(): boolean {
    return this.currentUrl === 'IniciarSesionUrl'
  }

  isRegister(): boolean {
    return this.currentUrl === 'RegistrarseUrl';
  }
}
