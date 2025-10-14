import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { Profile } from './features/user/pages/profile/profile';
import { AuthGuard } from './core/services/auth-service';
import { Actividades } from './features/actividades/pages/actividades/actividades';

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
        path: 'profile',
        component: Profile,
        canActivate: [AuthGuard]
    },
    {
        path: 'actividades',
        component: Actividades,
        canActivate: [AuthGuard]
    }
];
