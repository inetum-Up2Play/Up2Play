import { Router, RouterLink, RouterModule } from '@angular/router';
import { Component, ElementRef, inject, ViewChild, Renderer2, OnInit, signal, computed, ViewEncapsulation } from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { MenubarModule } from 'primeng/menubar';
import { RippleModule } from 'primeng/ripple';
import { BadgeModule } from 'primeng/badge';
import { AvatarModule } from 'primeng/avatar';
import { InputTextModule } from 'primeng/inputtext';
import { DrawerModule } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';

import { AuthService } from '../../services/auth/auth-service';
import { UserDataService } from '../../services/auth/user-data-service';
import { AvatarPipe } from '../../../shared/pipes/avatar-pipe';
import { PerfilService } from '../../services/perfil/perfil-service';

interface MenuItemPages {
  label: string;
  icon: string;
  route?: string;      
  command?: () => void; 
  styleClass?: string; 
  children?: MenuItem[];
}

@Component({
  selector: 'app-header',
  imports: [RouterModule, RouterLink, MenubarModule, RippleModule, BadgeModule, AvatarModule, InputTextModule, DrawerModule, ButtonModule, MenuModule, AvatarPipe],
  templateUrl: './header.html',
  styleUrls: ['./header.scss'],
  encapsulation: ViewEncapsulation.None
})

export class Header implements OnInit {
  private router = inject(Router);
  private authService = inject(AuthService);
  private userDataService = inject(UserDataService);
  public perfilService = inject(PerfilService);
  private renderer = inject(Renderer2); // Para manipular el DOM
  private document = inject(DOCUMENT); // Referencia al Documento

  // Signal que almacena el email una sola vez y no cambia más
  private userEmailSignal = signal<string>('');
  public userAvatar = signal<number | null>(null);

  visible = false;

  items: MenuItemPages[] = [
    { label: 'Inicio', icon: 'ph-fill ph-house', route: '/' },
    { label: 'Actividades', icon: 'ph-fill ph-bookmark-simple', route: '/actividades' },
    { label: 'Pagos', icon: 'ph-fill ph-cardholder', route: '/pagos/historial-pagos' },
    { label: 'Notificaciones', icon: 'ph-fill ph-bell', route: '/notificaciones' },
    { label: 'Historial', icon: 'ph-fill ph-clock-counter-clockwise', route: '/historial' },
    { label: 'Mi Cuenta', icon: 'ph-fill ph-user', route: '/perfil' },
    { 
      label: 'Cerrar sesión', 
      icon: 'ph-fill ph-sign-out', 
      styleClass: 'logout-item', 
      command: () => {
        this.authService.logout(); 
      } 
    },
  ];

  trackByLabel(item: MenuItemPages) {
    return item.label;
  }

  // Página activa 
  isActive(route: string, exact = true): boolean {
    return exact ? this.router.url === route : this.router.url.startsWith(route);
  } 

  ngOnInit(): void {
    // Obtiene el email la primera vez
    const email = this.userDataService.getEmail();

    // Obtiene el email del signal del servicio las posteriores veces
    if (!email || email.trim() === '') {
      const serviceEmail = this.userDataService.getEmailSignal()();
      this.userEmailSignal.set(serviceEmail);
    } else {
      this.userEmailSignal.set(email);
    }

    //Modifica el avatar del header. Es una signal que se encuentra en PerfilService
    this.perfilService.getPerfil().subscribe({
      next: (perfil) => {
        const imgAvatar = (perfil as any)?.imagenPerfil ?? 0;
        this.perfilService.avatarGlobal.set(imgAvatar);
      },
      error: () => {
        this.perfilService.avatarGlobal.set(0);
        console.warn('No se pudo cargar el avatar del header')
      }
    });

    this.renderer.addClass(this.document.body, 'header-background-active'); //img-fondo
    this.renderer.addClass(this.document.body, 'header-offset-active'); //necesario para fixed-top
  }

  // Calcular tamaño del header
  //Busca id menu-superior en el html, con ElementRef lo referencia
  @ViewChild('menuSuperior', { static: true }) headerRef!: ElementRef<HTMLElement>;

  //ResizeObserver para observar cambios en el tamaño del header
  private ro?: ResizeObserver;

  //Después de que la vista se haya inicializado
  ngAfterViewInit() {
    const headerEl = this.headerRef.nativeElement;

    // Calcula altura del header y la asigna a la variable CSS --header-h
    const setVar = () => {
      const h = headerEl.getBoundingClientRect().height;
      document.documentElement.style.setProperty('--header-h', `${h}px`);
    };

    // Inicializa la variable CSS --header-h
    setVar();

    // Observa cambios dinámicos
    this.ro = new ResizeObserver(setVar);
    this.ro.observe(headerEl);
  }

  // Se elimina el recurso si sales del componente(ej login)
  ngOnDestroy() {
    this.ro?.disconnect();
    this.renderer.removeClass(this.document.body, 'header-background-active'); //img-fondo
    this.renderer.removeClass(this.document.body, 'header-offset-active'); //necesario para fixed-top
  }

}
