import { Router, RouterModule } from '@angular/router';
import {
  Component,
  ElementRef,
  inject,
  signal,
  ViewChild, Renderer2
} from '@angular/core';
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
  styleUrls: ['./header.scss'],
})
export class Header {
  private router = inject(Router);
  visible = false;

  private renderer = inject(Renderer2); // Para manipular el DOM
  private document = inject(DOCUMENT); // Referencia al Documento

  items: MenuItemPages[] = [
    { label: 'Inicio', icon: 'pi pi-home', route: '/' },
    { label: 'Actividades', icon: 'pi pi-bookmark', route: '/actividades' },
    { label: 'Pagos', icon: 'pi pi-chart-line', route: '/pagos' },
    { label: 'Notificaciones', icon: 'pi pi-users', route: '/notificaciones' },
    { label: 'Historial', icon: 'pi pi-calendar', route: '/historial' },
    { label: 'Mi Cuenta', icon: 'pi pi-cog', route: '/micuenta' },
  ];

  trackByLabel(index: number, item: MenuItemPages) {
    return item.label;
  }

  // Página activa 
  isActive(route: string, exact = true): boolean {
    return exact ? this.router.url === route : this.router.url.startsWith(route);
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
        command: () => this.logout(),
      },
    ];
    this.renderer.addClass(this.document.body, 'header-background-active'); //img-fondo
    this.renderer.addClass(this.document.body, 'header-offset-active'); //necesario para fixed-top
  }

  logout(): void {
    // Aquí tu lógica de cierre de sesión
    // authService.logout(); router.navigate(['/login']);
    console.log('Cerrar sesión');
  }

  // Calcular tamaño del header
  //Busca id menu-superior en el html, con ElementRef lo referencia
  @ViewChild('menuSuperior', { static: true }) headerRef!: ElementRef<HTMLElement>;

  //ResizeObserver para observar cambios en el tamaño del header
  private ro?: ResizeObserver;

  //Después de que la vista se haya inicializado
  ngAfterViewInit() {
    const headerEl = this.headerRef.nativeElement;

    // Calculo altura del header y la asigno a la variable CSS --header-h
    const setVar = () => {
      const h = headerEl.getBoundingClientRect().height;
      document.documentElement.style.setProperty('--header-h', `${h}px`);
    };

    // Inicializo la variable CSS --header-h
    setVar();

    // Observa cambios dinámicos
    this.ro = new ResizeObserver(setVar);
    this.ro.observe(headerEl);
  }

  // Se elimina el recurso si sales del componente(ej login)
  ngOnDestroy() {
    this.ro?.disconnect();
    this.renderer.removeClass(this.document.body, 'header-background-active'); //img-fondo
    this.renderer.addClass(this.document.body, 'header-offset-active'); //necesario para fixed-top
  }

}
