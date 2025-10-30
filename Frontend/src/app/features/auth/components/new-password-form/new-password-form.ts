import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, AbstractControl, ValidationErrors, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';

@Component({
  selector: 'app-new-password-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IconFieldModule,
    InputIconModule
  ],
  templateUrl: './new-password-form.html',
  styleUrls: ['./new-password-form.scss']
})
export class NewPasswordForm {
  private fb = inject(FormBuilder);
  private router = inject(Router);

  form = this.fb.group({
    newPassword: ['', [Validators.required, this.passwordValidator]],
    confirmPassword: ['', Validators.required]
  }, { validators: this.passwordsMatchValidator });

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

    const valid = hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar && hasMinLength;
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

    const newPassword = this.f.newPassword.value;
    console.log('Nueva contraseña:', newPassword);

    // Aquí iría la llamada al servicio para cambiar la contraseña
    // this.authService.changePassword(newPassword).subscribe(...);

    this.router.navigate(['/auth/login']);
  }
}