import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
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
import { AuthService } from '../../../../core/services/auth-service';
import { UserDataService } from '../../../../core/services/user-data-service';

interface NewPassword {
  email: string;
  password: string;
}

@Component({
  selector: 'app-new-password-form',
  // si es componente standalone, añade:
  // standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IconFieldModule, InputIconModule],
  templateUrl: './new-password-form.html',
  styleUrls: ['./new-password-form.scss'],
})
export class NewPasswordForm implements OnInit {
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

  ngOnInit(): void {
    this.email = this.userDataService.getEmail() ?? '';
    console.log('Email cargado desde UserDataService:', this.email);
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
      hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar && hasMinLength;
    return valid ? null : { passwordStrength: true };
  }

  passwordsMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('newPassword')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return password === confirm ? null : { passwordsMismatch: true };
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const payload: NewPassword = {
      email: this.email,
      password: this.f.newPassword.value!,
    };

    console.log('Payload a enviar:', payload);

    this.authService.saveNewPassword(payload).subscribe({
      next: () => {
        this.router.navigate(['/auth/login']);
      },
      error: (err) => {
        this.errorMessage =
          err.error?.message || 'La contraseña está mal :(';
        console.error('Error al guardar nueva contraseña:', err);
      },
    });
  }
}
