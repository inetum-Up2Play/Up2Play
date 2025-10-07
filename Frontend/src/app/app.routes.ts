import { Routes } from '@angular/router';
import { Login } from './features/auth/pages/login/login';
import { Register } from './features/auth/pages/register/register';
import { Home } from './features/home/home';
import { Profile } from './features/user/pages/profile/profile';
import { AuthGuard } from './core/services/auth-service';
import { Actividades } from './features/actividades/pages/actividades/actividades';

export const routes: Routes = [
    {
        path: 'home',
        component: Home
    },
    {
        path: 'auth/login',
        component: Login
    },
    {
        path: 'auth/register',
        component: Register
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
