import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { Profile } from './features/user/pages/profile/profile';
import { AuthService } from './core/services/auth/auth-service';
import { Actividades } from './features/actividades/pages/actividades/actividades';
import { inject } from '@angular/core';
import { Header } from './core/layout/header/header';
import { Background } from './core/layout/background/background/background';
import { CrearActividad } from './features/actividades/pages/crear-actividad/crear-actividad';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES),
  },

  // Zona protegida: TODO lo demás entra por el guard
  {
    path: '',
        canActivateChild: [
            (route, state) => {
                const auth = inject(AuthService);
                return auth.canActivate(state.url);
            }
        ],
            children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/home/home').then(m => m.Home),
      },
      {
        path: 'actividades',
        loadComponent: () =>
          import('./features/actividades/pages/actividades/actividades')
            .then(m => m.Actividades),
      },
      {
        path: 'prova',
        loadComponent: () =>
          import('./features/home/pruebaPrimeNG/pruebaPrimeNG.component')
            .then(m => m.PruebaPrimeNGComponent),
      },
      {
        path: 'my-account',
        component: Profile,
      },
      {
        path: 'crear-actividad',
        component: CrearActividad,
      }
    ],
  },

  // Cualquier otra ruta desconocida -> a home (protegida, por tanto pasará por el guard)
    {
        path: 'header',
        component: Header
    },

    {
        path: 'background',
        component: Background
    }
];