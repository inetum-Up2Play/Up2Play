import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Verification } from './pages/verification/verification';
import { VerificationPassword } from './pages/verification-password/verification-password';


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
    },
    {
        path: 'verification-password',
        component: VerificationPassword
    }
];