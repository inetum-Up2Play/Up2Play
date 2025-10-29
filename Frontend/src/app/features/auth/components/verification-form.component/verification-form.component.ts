import { Component, inject, OnInit, output, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserDataService } from '../../../../core/services/user-data-service'; // ajusta la ruta
import {
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  FormControl,
  AbstractControl
} from '@angular/forms';

// PrimeNG
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { CheckboxModule } from 'primeng/checkbox';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { Router, RouterModule } from '@angular/router';
// Conexion con el servicio
import { AuthService } from '../../../../core/services/auth-service';
import { Login } from '../../pages/login/login';

@Component({
  selector: 'app-verification-form',
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
  templateUrl: './verification-form.component.html',
  styleUrls: [
    './verification-form.component.scss'
  ]
})

export class VerificationFormComponent {
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