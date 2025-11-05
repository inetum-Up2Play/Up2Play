import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { Profile } from './features/user/pages/profile/profile';
import { AuthService } from './core/services/auth-service';
import { Actividades } from './features/actividades/pages/actividades/actividades';
import { inject } from '@angular/core';

export const routes: Routes = [
    {
        path: '',
        component: Home
    },
    {
        path: 'auth',
        loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
    },
    {
        path: 'actividades',
        canActivateChild: [
            (route, state) => {
                const auth = inject(AuthService);
                return auth.canActivate(state.url);
            }
        ],
        children: [
            {
                path: 'actividades',
                loadComponent: () =>
                import('./features/actividades/pages/actividades/actividades').then(m => m.Actividades)
            },
            {
                path: 'prova',
                loadComponent: () =>
                import('./features/home/pruebaPrimeNG/pruebaPrimeNG.component').then(m => m.PruebaPrimeNGComponent)
            },
        ]
    },
    {
        path:'my-account',
        component: Profile
    }
];
