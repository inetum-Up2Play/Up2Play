import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-auth-header',
  imports: [RouterModule],
  templateUrl: './auth-header.component.html',
  styleUrl: './auth-header.component.scss'
})

export class AuthHeaderComponent {
  landingUrl = 'http://127.0.0.1:5500/Landing/index.html'
  IniciarSesionUrl = '/auth/login'
  RegistrarseUrl = '/auth/register'
  VerificarUrl = '/auth/verification'

  constructor(private router: Router) {
  }


  isLogin(): boolean {
    return this.router.url === this.IniciarSesionUrl;
  }

  isRegister(): boolean {
    return this.router.url === this.RegistrarseUrl;
  }

  isVerification(): boolean {
    return this.router.url === this.VerificarUrl;
  }

}


