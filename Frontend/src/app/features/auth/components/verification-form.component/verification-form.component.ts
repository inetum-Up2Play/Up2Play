
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';


// PrimeNG
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
// Conexion con el servicio
import { AuthService } from '../../../../core/services/auth-service';
import { UserDataService } from '../../../../core/services/user-data-service';

interface VerificationPayload {
  email: string;
  verificationCode: string;
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
  ],
  templateUrl: './verification-form.component.html',
  styleUrls: [
    './verification-form.component.scss'
  ]
})

export class VerificationFormComponent implements OnInit{
  private userDataService = inject(UserDataService);
  private authService = inject(AuthService);
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
    this.resendMessageVisible = true;
    this.authService.resendVerificationCode(this.email).subscribe({
    });

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
          this.errorMessageToken = 'No se encontró token ni email. Redirigiendo...';
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

    this.authService.verification(payload).subscribe({
      next: (res) => {
        this.loading = false;
        this.router.navigate(['/auth/login']);
      },
      error: (err) => {
        // No redirige. Muestra el mensaje de error
        this.loading = false;
        this.errorMessage = err.error?.message || 'El código de verificación es incorrecto o ha expirado.';
        console.error('Error de verificación:', err);

      }
    });
  }
}

