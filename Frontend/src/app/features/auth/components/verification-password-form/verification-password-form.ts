import { UserDataService } from '../../../../core/services/user-data-service';
import {
  FormBuilder,
  Validators,
  FormControl,
  AbstractControl
} from '@angular/forms';

// Conexion con el servicio
import { AuthService } from '../../../../core/services/auth-service';
import { Login } from '../../pages/login/login';

import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';

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
    RouterModule
  ],
  templateUrl: './verification-password-form.html',
  styleUrl: './verification-password-form.scss'
})
export class VerificationPasswordForm {
  private userDataService = inject(UserDataService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private readonly rawEmail = this.userDataService.getEmail();

  errorMessage: string | null = null;

  resendMessageVisible = false;

  email = this.userDataService.getEmail();


  onTyping() {
    // borra el mensaje de error al escribir o borrar
    this.errorMessage = null;
  }

  form = this.fb.group(
    {
      verificationCode: this.fb.nonNullable.control('', [Validators.required]),
    }
  );

  // Atajo para no escribir 'this.form.controls' todo el rato en la plantilla
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

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched(); // enseña errores
      return;
    }

    const payload = {
      email: this.email,
      verificationCode: this.f.verificationCode.value
    };

    this.authService.verification(payload).subscribe({
      next: (res) => {
        console.log("hola");
        this.router.navigate(['/auth/login']);
      },
      error: (err) => {
        // No redirige. Muestra el mensaje de error
        this.errorMessage = err.error?.message || 'El código de verificación es incorrecto o ha expirado.';
        console.error('Error de verificación:', err);

      }
    });

    console.log(payload);
  }
}
