import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  Validators,
  AbstractControl,
  ValidationErrors,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { MessageModule } from 'primeng/message';
import { AuthService } from '../../../../core/services/auth-service';
import { UserDataService } from '../../../../core/services/user-data-service';



interface newPassword {
  email: string;
  password: string;
}
@Component({
  selector: 'app-new-password-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IconFieldModule,
    InputIconModule,
    MessageModule
  ],
  templateUrl: './new-password-form.html',
  styleUrls: ['./new-password-form.scss'],
})
export class NewPasswordForm {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);
  private userDataService = inject(UserDataService);

  errorMessage: string | null = null;

  email = '';
  password = '';

  form = this.fb.group(
    {
      newPassword: ['', [Validators.required, this.passwordValidator]],
      confirmPassword: ['', Validators.required],
    },
    { validators: this.passwordsMatchValidator }
  );

  get f() {
    return this.form.controls;
  }

  passwordValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;

    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumber = /\d/.test(value);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
    const hasMinLength = value.length >= 8;

    const valid =
      hasUpperCase &&
      hasLowerCase &&
      hasNumber &&
      hasSpecialChar &&
      hasMinLength;
    return valid ? null : { passwordStrength: true };
  }

  passwordsMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('newPassword')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return password === confirm ? null : { passwordsMismatch: true };
  }

  onInit() {
    this.email = this.userDataService.getEmail() ?? '';
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const payload: newPassword = {
      email: this.email,
      password: this.f.newPassword.value!,
    };
    // Aquí iría la llamada al servicio para cambiar la contraseña

    this.authService.saveNewPassword(payload).subscribe({
      next: (res) => {
        this.router.navigate(['/auth/login']);
      },
      error: (err) => {
        // No redirige. Muestra el mensaje de error
        this.errorMessage =
          err.error?.message ||
          'La contraseña esta mal :(';
        console.error('La contraseña esta mal :', err);
      },
    });
  }
}
