import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth-service';

import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { UserDataService } from '../../../../core/services/user-data-service';
import { Router } from '@angular/router';
import { ErrorService } from '../../../../core/services/error-service';

@Component({
  selector: 'app-mail-form',
  imports: [IconFieldModule, CommonModule, ReactiveFormsModule, InputIconModule, InputTextModule, ButtonModule, MessageModule],
  templateUrl: './mail-form.component.html',
  styleUrl: './mail-form.component.scss'
})
export class MailFormComponent {
  private authService = inject(AuthService);
  private userDataService = inject(UserDataService);
  private errorService = inject(ErrorService);
  private router = inject(Router);

  private fb = inject(FormBuilder);

  form = this.fb.group(
    {
      email: this.fb.nonNullable.control('', [Validators.required]),
    }
  );

  // Atajo para no escribir 'this.form.controls' todo el rato en la plantilla
  get f() { return this.form.controls }

  // Para obtener el email y guardarlo en una variable actualizada
  get emailText(): string { return this.f.email.value ?? ''; }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched(); // enseña errores
      return;
    }

    //Descomentar cuando se haya hecho la lógica en el authService
    const payload = {
      email: this.emailText
    };

    this.authService.newPasswordCode(payload).subscribe({
      next: (res) => {
        if (res === true) {
          this.userDataService.setEmail(this.emailText); // ← Guarda el email
          this.router.navigate(['/auth/verification-password']); //Habrá que cambiarlo al nuevo
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


