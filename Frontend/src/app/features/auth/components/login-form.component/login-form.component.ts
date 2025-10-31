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
import { ErrorService } from '../../../../core/services/error-service';
import { MessageModule } from 'primeng/message';


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
    MessageModule
  ],
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})

export class LoginFormComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);
  private userDataService = inject(UserDataService);
  private errorService = inject(ErrorService);

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
          const mensaje = this.errorService.getMensajeError(res);  // Se traduce el mensaje con el controlErrores.ts
          this.errorService.showError(mensaje);                    // Se muestra con PrimeNG
        }
      },
      error: () => {
        this.errorService.showError('Error de red o del servidor. Intenta más tarde.');
      }
    });
  }

  redirectForgotPassword() {
    this.router.navigate(['/auth/mail-recover']);
  }

}

