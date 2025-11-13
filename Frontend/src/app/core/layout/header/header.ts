import { Router, RouterModule } from '@angular/router';
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenubarModule } from 'primeng/menubar';
import { RippleModule } from 'primeng/ripple';
import { BadgeModule } from 'primeng/badge';
import { AvatarModule } from 'primeng/avatar';
import { InputTextModule } from 'primeng/inputtext';
import { DrawerModule } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';



interface MenuItemPages {
  label: string;
  icon: string;     
  route?: string;
  children?: MenuItem[];
}

interface AvatarItem {
  label: string;
  icon: string;

}


@Component({
  selector: 'app-header',
  imports: [
    RouterModule,
    MenubarModule,
    RippleModule,
    BadgeModule,
    AvatarModule,
    InputTextModule,
    DrawerModule,
    ButtonModule,    
    MenuModule,
  ],
  templateUrl: './header.html',
  styleUrls: ['./header.scss']
})
export class Header {
  
  private router = inject(Router);

  landingUrl = 'http://127.0.0.1:5500/Up2Play/Landing/index.html'

  visible = false;

  items: MenuItemPages[] = [
    { label: 'Inicio', icon: 'pi pi-home', route: '/' },
    { label: 'Actividades', icon: 'pi pi-bookmark', route: '/actividades'},
    { label: 'Pagos', icon: 'pi pi-chart-line', route: '/pagos'},
    { label: 'Notificaciones', icon: 'pi pi-users', route: '/notificaciones' },
    { label: 'Historial', icon: 'pi pi-calendar', route: '/historial' },
    { label: 'Mi Cuenta', icon: 'pi pi-cog', route: '/micuenta' },
  ];
  
  trackByLabel(index: number, item: MenuItemPages) {
    return item.label;
  }


  avatarItems: MenuItem[] = [];
  userEmail = 'usuario@tu-dominio.com';

  
 ngOnInit(): void {
    this.avatarItems = [
      {
        label: this.userEmail,
        icon: 'pi pi-envelope',
      },
      {
        label: 'Cerrar sesión',
        icon: 'pi pi-sign-out',
        command: () => this.logout()
      }
    ];
  }

  logout(): void {
    // Aquí tu lógica de cierre de sesión
    // authService.logout(); router.navigate(['/login']);
    console.log('Cerrar sesión');
  }






}
