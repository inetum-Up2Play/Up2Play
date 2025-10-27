import { Component, inject, OnInit, output, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserDataService } from '../../../../core/services/user-data-service'; // ajusta la ruta
import {
  FormBuilder,
  Validators,
  ReactiveFormsModule
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
  private userData = inject(UserDataService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private readonly rawEmail = this.userData.getEmail();

  email = this.userData.getEmail();
  

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
    this.authService.resendVerificationCode(this.email).subscribe({
    });

    console.log(this.email);
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched(); // enseña errores
      return;
    }

    /*     if (!this.rawEmail) {
          // Manejo UX: redirigir o avisar
          console.error('Email no disponible para verificación.');
          this.router.navigate(['/auth/signup']); // ajusta a tu flujo
          return;
        } */

    const payload = {
      email: this.email,
      verificationCode: this.f.verificationCode.value
    };

    this.authService.verification(payload).subscribe({
      next: (res) => {
        this.router.navigate(['/auth/login']);
      }
    });

    console.log(payload);
  }
}