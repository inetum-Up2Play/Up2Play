import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Verification } from './pages/verification/verification';


export const AUTH_ROUTES: Routes = [
    { 
        path: 'login', 
        component: Login 
    },
    { 
        path: 'register', 
        component: Register
    },
    {
        path: 'verification',
        component: Verification
    }
];