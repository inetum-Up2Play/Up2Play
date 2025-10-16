import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserDataService } from '../../../../core/services/user-data-service'; // ajusta la ruta
import {
  FormBuilder,
  Validators,
  AbstractControl,
  ValidationErrors,
  ReactiveFormsModule
} from '@angular/forms';

// PrimeNG
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { CheckboxModule } from 'primeng/checkbox';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';

// Conexion con el servicio
import { AuthService } from '../../../../core/services/auth-service';
import { Router, RouterModule } from '@angular/router';

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
    IconField
],
  templateUrl: './register-form.component.html',
  styleUrls: [
    './register-form.component.scss'
    // 'node_modules/primeicons/primeicons.css'
  ]
})

export class RegisterFormComponent {
  constructor(private router: Router) {}
  private fb = inject(FormBuilder);
  private auth = inject(AuthService); // cuando tengas el servicio
  private userData = inject(UserDataService);


  //en un futuro poner esto en el shard y exportarlo
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

    const payload = {
      email: this.f.email.value,
      password: this.f.password.value,
      nombre_usuario: this.f.nombre_usuario.value
    };

    this.auth.register(payload).subscribe({
      next: (res) => {
          this.userData.setEmail(payload.email); // ← Guarda el email
          
          const verifyEmail = this.router.parseUrl('/auth/verification'); // ajusta la ruta si es necesario
          void this.router.navigateByUrl(verifyEmail, { skipLocationChange: true });
          
      },
      error: (err) => {
        if (err.status === 409) {
          console.error('Email ya registrado');
        } else {
          console.error('Error desconocido:', err);
        }
      }
    });

    console.log('Registrando con:', payload);
  }
}