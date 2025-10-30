import { Component, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';

// PrimeNG
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services/auth-service';
import { UserDataService } from '../../../../core/services/user-data-service';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';


@Component({
  selector: 'app-login-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    IconFieldModule,
    InputIconModule,
    RouterModule,
    Toast
  ],
  providers: [MessageService],
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})

export class LoginFormComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);
  private userDataService = inject(UserDataService);
  private messageService = inject(MessageService);

  showPassword: boolean = false;

  submitted = output<{ email: string; password: string }>();

  form = this.fb.group(
    {
      email: this.fb.nonNullable.control('', [Validators.required, Validators.email]),
      password: this.fb.nonNullable.control('', [Validators.required]),
    }
  );

  // Atajo para no escribir 'this.form.controls' todo el rato en la plantilla
  get f() {
    return this.form.controls;
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched(); // enseña errores
      return;
    } else {
      this.submitted.emit(this.form.getRawValue()); // <- envía {email, password}
    }

    const payload = {
      email: this.f.email.value,
      password: this.f.password.value,
    };

    this.authService.login(payload).subscribe({
      next: (res) => {
        if (res === true) {
          this.userDataService.setEmail(payload.email);
          this.router.navigate(['/auth/my-account']);
        } else {
          // Aquí maneja los errores devueltos del authService
          switch (res) {
            case 'CREDENCIALES_ERRONEAS':
              this.showError('Credenciales incorrectas. Por favor, verifica tu email y contraseña.');
              break;
            case 'USUARIO_NO_VERIFICADO':
              this.showError('Tu cuenta no ha sido verificada. Revisa tu correo electrónico.');
              break;
            case 'USUARIO_NO_ENCONTRADO':
              this.showError('Usuario no encontrado.');
              break;
            case 'CORREO_NO_COINCIDE':
              this.showError('El correo no coincide con el usuario.');
              break;
            case 'USUARIO_BLOQUEADO_LOGIN':
              this.showError('Tu cuenta está bloqueada. Contacta con soporte.');
              break;
            default:
              this.showError('Error desconocido: ' + res);
          }
        }
      },
      error: (err) => {
        // Este bloque solo se ejecutará si ocurre un error fuera del flujo normal (por ejemplo, error de red)
        this.showError('Error de red o del servidor. Intenta más tarde.');
      }
    });
  }

  redirectForgotPassword() {
    this.router.navigate(['/auth/mail-recover']);
  }

  showError(detail: string) {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: detail
    });
  }


}

