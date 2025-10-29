
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
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    IconFieldModule,
    InputIconModule,
    RouterModule
  ],
  templateUrl: './verification-form.component.html',
  styleUrls: [
    './verification-form.component.scss'
  ]
})

export class VerificationFormComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private userData = inject(UserDataService);


  token = '';
  email = '';
  loading = false;
  errorMessage = '';

  form = this.fb.group({
    verificationCode: this.fb.nonNullable.control('', [Validators.required]),
  });

  get f() {
    return this.form.controls;
  }


  onClickResend() {
    this.authService.resendVerificationCode(this.email).subscribe({
    });

    console.log(this.email);
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.token = params['token'] ?? '';
      if (this.token) {
        this.validateToken(this.token);
      } else {
        this.email = this.userData.getEmail() ?? '';
        if (!this.email) {
          this.errorMessage = 'No se encontró token ni email. Redirigiendo...';
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
        this.errorMessage = 'Token inválido o expirado.';
        console.error('Error validando token:', err);
      },
    });
  }

  onSubmit(): void {
    if (this.form.invalid || !this.email) {
      this.form.markAllAsTouched();
      this.errorMessage = 'Email no disponible para verificación.';
      return;
    }

    this.loading = true;
    const payload: VerificationPayload = {
      email: this.email,
      verificationCode: this.f.verificationCode.value,
    };


    this.authService.verification(payload).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/auth/login']);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = 'Error en la verificación. Intenta nuevamente.';
        console.error('Error en verificación:', err);
      },
    });
  }
}
