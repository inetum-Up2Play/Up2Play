import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { Profile } from './features/user/pages/profile/profile';
import { AuthService } from './core/services/auth/auth-service';
import { inject } from '@angular/core';
import { CrearActividad } from './features/actividades/pages/crear-actividad/crear-actividad';

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
        loadComponent: () =>
          import('./features/home/home').then(m => m.Home),
      },
      {
        path: 'my-account',
        component: Profile,
      },
    ],
  }

];