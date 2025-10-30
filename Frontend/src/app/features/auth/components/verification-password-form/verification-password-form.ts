import { UserDataService } from '../../../../core/services/user-data-service';
import {
  FormBuilder,
  Validators,
  FormControl,
  AbstractControl,
} from '@angular/forms';

// Conexion con el servicio
import { AuthService } from '../../../../core/services/auth-service';
import { Login } from '../../pages/login/login';

import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';

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
  ],
  templateUrl: './verification-password-form.html',
  styleUrl: './verification-password-form.scss',
})
export class VerificationPasswordForm {
  private userDataService = inject(UserDataService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private activatedRoute = inject(ActivatedRoute);

  errorMessage: string | null = null;

  resendMessageVisible = false;

  onTyping() {
    // borra el mensaje de error al escribir o borrar
    this.errorMessage = null;
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

    console.log(this.email);

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
      next: (res: { email: string }) => {
        this.loading = false;
        this.email = res.email;
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
        this.loading = false;
        this.router.navigate(['/auth/new-password']);
      },
      error: (err) => {
        // No redirige. Muestra el mensaje de error
        this.loading = false;
        this.errorMessage =
          err.error?.message ||
          'El código de verificación es incorrecto o ha expirado.';
        console.error('Error de verificación:', err);
      },
    });
  }
}
