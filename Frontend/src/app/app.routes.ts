import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { AuthService } from './core/services/auth/auth-service';
import { inject } from '@angular/core';
import { Profile } from './features/profile/pages/profile/profile';
import { Notificaciones } from './features/notificaciones/notificaciones';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES),
  },

  // Zona protegida: TODO lo demás entra por el guard
  // Cualquier otra ruta desconocida -> a home (protegida, por tanto pasará por el guard)

  {
    path: '',
        canActivateChild: [
            (route, state) => {
                const authService = inject(AuthService);
                return authService.canActivate(state.url);
            }
        ],
    children: [
      {
        path: 'actividades',
        loadChildren: () => import('./features/actividades/act.routes').then(m => m.ACT_ROUTES),
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
        component: Notificaciones
      }
    ],
  }

];