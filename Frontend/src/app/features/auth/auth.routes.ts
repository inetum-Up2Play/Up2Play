import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Verification } from './pages/verification/verification';
import { MailRecover } from './pages/mail-recover/mail-recover';
import { VerificationPassword } from './pages/verification-password/verification-password';
import { NewPassword } from './pages/new-password/new-password';


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
        path: 'mail-recover',
        component: MailRecover
    },
    {
        path: 'verification-password',
        component: VerificationPassword
    },
    {
        path: 'new-password',
        component: NewPassword
    }
];