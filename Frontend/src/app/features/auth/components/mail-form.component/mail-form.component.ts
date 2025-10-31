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

@Component({
  selector: 'app-mail-form',
  imports: [IconFieldModule, CommonModule, ReactiveFormsModule, InputIconModule, InputTextModule, ButtonModule, MessageModule],
  templateUrl: './mail-form.component.html',
  styleUrl: './mail-form.component.scss'
})
export class MailFormComponent {
  private authService = inject(AuthService);
  private userDataService = inject(UserDataService);
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
        this.userDataService.setEmail(this.emailText); // ← Guarda el email
        this.router.navigate(['/auth/verification-password']);
      },
      error: (err) => {
        if (err.status === 401) { //Aquí hay que poner el error que diga que ese email no existe en la BBDD
          console.error('El email no existe');
        } else {
          console.error('Error desconocido:', err);
        }
      }
    });

  }
}
