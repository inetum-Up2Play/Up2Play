import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';

// PrimeNG
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';

// Services
import { AuthService } from '../../../../core/services/auth/auth-service';
import { UserDataService } from '../../../../core/services/auth/user-data-service';
import { ErrorService } from '../../../../core/services/error/error-service';

interface ResendVerificationDto {
  email: string;
}

interface VerificationPayload {
  email: string;
  verificationCode: string;
}

@Component({
  selector: 'app-verification-password-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    FloatLabelModule,
    CheckboxModule,
    IconFieldModule,
    InputIconModule,
    RouterModule,
    MessageModule
  ],
  templateUrl: './verification-password-form.html',
  styleUrl: './verification-password-form.scss',
})
export class VerificationPasswordForm {
  private userDataService = inject(UserDataService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private errorService = inject(ErrorService);
  private fb = inject(FormBuilder);
  private activatedRoute = inject(ActivatedRoute);

  errorMessage: string | null = null;
  

  resendMessageVisible = false;

  onTyping() {
    this.errorMessage = null; // Borra el mensaje de error al escribir o borrar
  }

  token = '';
  email = '';
  loading = false;
  errorMessageToken = '';

  form = this.fb.group({
    verificationCode: this.fb.nonNullable.control('', [Validators.required]),
  });

  // Atajo para no escribir 'this.form.controls' todo el rato en la plantilla
  get f() {
    return this.form.controls;
  }

  onClickResend() {
    const payload: ResendVerificationDto = {
      email: this.email,
    };

    this.resendMessageVisible = true;
    this.authService.resendNewPasswordCode(payload).subscribe({});


    setTimeout(() => {
      this.resendMessageVisible = false;
    }, 15000); // 15 segundos
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.token = params['token'] ?? '';
      if (this.token) {
        this.validateToken(this.token);
      } else {
        this.email = this.userDataService.getEmail() ?? '';
        if (!this.email) {
          this.errorMessageToken =
            'No se encontró token ni email. Redirigiendo...';
          this.router.navigate(['/auth/register']);
        }
      }
    });
  }

validateToken(token: string): void {
  this.loading = true;
  this.authService.validateToken(token).subscribe({
    next: (res: string | { email: string }) => {
      this.loading = false;

        if (typeof res === 'string') {
          this.errorMessageToken = res;  //Muestra respuesta con string
        } else {
          this.email = res.email;  //Muestra respuesta con payload
        }

      this.userDataService.setEmail(this.email);
    },
    error: (err) => {
      this.loading = false;
      this.errorMessageToken = 'Token inválido o expirado.';
      console.error('Error validando token:', err);
    },
  });
}

  onSubmit(): void {
    if (this.form.invalid || !this.email) {
      this.form.markAllAsTouched();
      this.errorMessageToken = 'Email no disponible para verificación.';
      return;
    }

    const payload: VerificationPayload = {
      email: this.email,
      verificationCode: this.f.verificationCode.value,
    };

    this.authService.verifyNewPasswordCode(payload).subscribe({
      next: (res) => {
        if (res === true) {
          this.loading = false;
          console.log('hollaaaaa');
          this.userDataService.setEmail(this.email);
          this.router.navigate(['/auth/new-password']);
        } else {
          this.loading = false;
          const mensaje = this.errorService.getMensajeError(res);  // Se traduce el mensaje con el controlErrores.ts
          this.errorService.showError(mensaje);                    // Se muestra con PrimeNG
        }
      },
      error: () => {
        this.loading = false;
        this.errorService.showError('Error de red o del servidor. Intenta más tarde.');
      }
    });
  }
}
