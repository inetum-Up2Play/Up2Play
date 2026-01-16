import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './core/services/auth/auth-service';
import { Home } from './features/home/home';
import { Profile } from './features/profile/pages/profile/profile';
import { Notificaciones } from './features/notificaciones/notificaciones';
import { Historial } from './features/historial/pages/historial/historial';
import { PoliticaDevoluciones } from './features/legal/politica-devoluciones/politica-devoluciones';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },
  // Zona protegida: TODO lo demás entra por el guard
  // Cualquier otra ruta desconocida -> a home (protegida, por tanto pasará por el guard)

  {
    path: '',
    canActivateChild: [
      (route, state) => {
        const authService = inject(AuthService);
        return authService.canActivate(state.url);
      },
    ],
    children: [
      {
        path: 'actividades',
        loadChildren: () =>
          import('./features/actividades/act.routes').then((m) => m.ACT_ROUTES),
      },
      {
        path: '',
        component: Home,
      },
      {
        path: 'perfil',
        component: Profile,
      },
      {
        path: 'notificaciones',
        component: Notificaciones,
      },
      {
        path: 'pagos',
        loadChildren: () =>
          import('./features/pagos/pay.routes').then((m) => m.PAY_ROUTES),
      },
      {
        path: 'historial',
        component: Historial,
      },
      {
        path: 'legal/devoluciones',
        component: PoliticaDevoluciones,
      },
    ],
  },
];
