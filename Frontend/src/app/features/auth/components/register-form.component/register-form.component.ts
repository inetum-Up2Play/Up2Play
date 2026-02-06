import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, AbstractControl, ValidationErrors, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

// PrimeNG
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { CheckboxModule } from 'primeng/checkbox';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { MessageModule } from 'primeng/message';

// Services
import { AuthService } from '../../../../core/services/auth/auth-service';
import { UserDataService } from '../../../../core/services/auth/user-data-service';
import { ErrorService } from '../../../../core/services/error/error-service';

function passwordsMatchValidator(group: AbstractControl): ValidationErrors | null {
  const password = group.get('password')?.value;
  const confirm = group.get('confirmPassword')?.value;
  if (!password || !confirm) return null; // no validar mientras escribe
  return password === confirm ? null : { passwordsDontMatch: true };
}

@Component({
  selector: 'app-register-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    FloatLabelModule,
    CheckboxModule,
    RouterModule,
    InputIcon,
    IconField,
    MessageModule
  ],
  templateUrl: './register-form.component.html',
  styleUrls: [
    './register-form.component.scss'
  ]
})

export class RegisterFormComponent {
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private userDataService = inject(UserDataService);
  private errorService = inject(ErrorService);

  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  loading = signal(false);


  // En un futuro poner esto en el shard y exportarlo
  private PASSWORD_POLICY = /^(?=.*\p{Ll})(?=.*\p{Lu})(?=.*\p{Nd})(?=.*[^\p{L}\p{N}\s])(?!.*\s).+$/u;

  form = this.fb.group(
    {
      nombre_usuario: this.fb.nonNullable.control('', [Validators.required, Validators.minLength(3), Validators.maxLength(25)]),
      email: this.fb.nonNullable.control('', [Validators.required, Validators.email, Validators.maxLength(255)]),
      password: this.fb.nonNullable.control('', [Validators.required, Validators.minLength(8), Validators.maxLength(255), Validators.pattern(this.PASSWORD_POLICY)]),
      confirmPassword: this.fb.nonNullable.control('', [Validators.required, Validators.minLength(8), Validators.maxLength(255), Validators.pattern(this.PASSWORD_POLICY)]),
      aceptaTerminos: this.fb.nonNullable.control(false, { validators: Validators.requiredTrue })
    },
    { validators: [passwordsMatchValidator] } // Valida que coincidan
  );

  // Atajo para no escribir 'this.form.controls' todo el rato en la plantilla
  get f() {
    return this.form.controls;
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched(); // enseña errores
      return;
    }
    
    this.loading.set(true);

    const payload = {
      email: this.f.email.value,
      password: this.f.password.value,
      nombre_usuario: this.f.nombre_usuario.value
    };

    this.authService.register(payload).subscribe((res) => {
      if (res === true) {
        this.userDataService.setEmail(payload.email); // ← Guarda el email
        this.loading.set(false);
        this.router.navigate(['/auth/verification']);
      } else {
        this.errorService.showError(this.errorService.getMensajeError(res));
      }
    });

  }
}