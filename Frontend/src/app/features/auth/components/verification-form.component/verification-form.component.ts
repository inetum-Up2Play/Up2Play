import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

// PrimeNG
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { MessageModule } from 'primeng/message';

// Services
import { AuthService } from '../../../../core/services/auth-service';
import { UserDataService } from '../../../../core/services/user-data-service';
import { ErrorService } from '../../../../core/services/error-service';

interface VerificationPayload {
  email: string;
  verificationCode: string;
}

interface ResendVerificationDto {
  email: string;
}

@Component({
  selector: 'app-verification-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    IconFieldModule,
    InputIconModule,
    RouterModule,
    MessageModule
  ],
  templateUrl: './verification-form.component.html',
  styleUrls: ['./verification-form.component.scss'],
})
export class VerificationFormComponent implements OnInit {
  private userDataService = inject(UserDataService);
  private authService = inject(AuthService);
  private errorService = inject(ErrorService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private fb = inject(FormBuilder);

  errorMessage: string | null = null;

  resendMessageVisible = false;

  // borra el mensaje de error al escribir o borrar
  onTyping() {
    this.errorMessage = null;
  }

  token = '';
  email = '';
  loading = false;
  errorMessageToken = '';

  form = this.fb.group({
    verificationCode: this.fb.nonNullable.control('', [Validators.required]),
  });

  get f() {
    return this.form.controls;
  }

  onClickResend() {
    const payload: ResendVerificationDto = {
      email: this.email,
    };

    this.resendMessageVisible = true;
    this.authService.resendVerificationCode(payload).subscribe({});

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
          this.router.navigate(['/auth/signup']);
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

    this.authService.verification(payload).subscribe({
      next: (res) => {
        if (res === true) {
          this.loading = false;
          this.router.navigate(['/auth/login']);
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
}
