import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Menu, MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-auth-header',
  imports: [RouterModule, Menu, MenuModule, ButtonModule],
  templateUrl: './auth-header.component.html',
  styleUrl: './auth-header.component.scss'
})

export class AuthHeaderComponent {
  landingUrl = 'http://127.0.0.1:5500/Up2Play/Landing/index.html'
  IniciarSesionUrl = '/auth/login'
  RegistrarseUrl = '/auth/register'
  VerificarUrl = '/auth/verification'

  constructor(private router: Router) {
  }

  items: MenuItem[] | undefined;

  ngOnInit() {
    this.items = [
      {
        label: 'MENÚ',
        items: [
          { label: 'Inicio', routerLink: ['http://127.0.0.1:5500/Up2Play/Landing/index.html'] }, // Angular Router
          { label: 'Registrarse', routerLink: ['/auth/register'] }, // Angular Router
          { label: 'Iniciar sesión', routerLink: ['/auth/login'] }, // Angular Router
        ]
      }
    ];
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


