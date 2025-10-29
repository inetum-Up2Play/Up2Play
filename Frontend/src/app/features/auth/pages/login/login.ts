import { Component, inject } from '@angular/core';
import { LoginFormComponent } from '../../components/login-form.component/login-form.component';
import { AuthFooterComponent } from '../../components/auth-footer.component/auth-footer.component';
import { AuthHeaderComponent } from '../../components/auth-header.component/auth-header.component';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth-service';
import { UserDataService } from '../../../../core/services/user-data-service';

@Component({
  selector: 'app-login',
  imports: [LoginFormComponent, AuthFooterComponent, AuthHeaderComponent],
  providers: [MessageService],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})

export class Login {

  private authService = inject(AuthService);
  private userDataService = inject(UserDataService);
  private router = inject(Router);
  private message = inject(MessageService);

  onSubmit(payload: { email: string; password: string }) {
    this.authService.login(payload.email, payload.password).subscribe(result => {
      if (result === true) {
        this.message.add({ severity: 'success', summary: 'Bienvenido', detail: 'Sesión iniciada' });
        this.router.navigate(['']);
      } else if (result === 'INVALID_CREDENTIALS') {
        this.message.add({ severity: 'error', summary: 'Error', detail: 'Correo o contraseña incorrectos' });
      } else if (result === 'EMAIL_NOT_VERIFIED') {
        this.message.add({ severity: 'warn', summary: 'Verificación', detail: 'Cuenta no verificada. Revisa tu email.' });
        this.userDataService.setEmail(payload.email); 
        this.router.navigate(['/auth/verification']);
      } else {
        this.message.add({ severity: 'error', summary: 'Error', detail: 'Error inesperado' });
      }
    });
  }
}
