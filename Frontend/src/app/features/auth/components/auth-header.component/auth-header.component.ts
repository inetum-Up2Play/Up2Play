import { Component } from '@angular/core';
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
  landingUrl = 'http://127.0.0.1:5500/Landing/index.html'
  IniciarSesionUrl = '/auth/login'
  RegistrarseUrl = '/auth/register'
  VerificarUrl = '/auth/verification'
  isMenuOpen: boolean = false;

  constructor(private router: Router) { }

  items: MenuItem[] | undefined;

  ngOnInit() {
    this.items = [
      {
        items: [
          { label: 'Inicio', url: this.landingUrl, icon: 'pi pi-home' },
          { label: 'Registrarse', routerLink: [this.RegistrarseUrl], icon: 'pi pi-user-plus' },
          { label: 'Iniciar sesión', routerLink: [this.IniciarSesionUrl], icon: 'pi pi-key' },
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


