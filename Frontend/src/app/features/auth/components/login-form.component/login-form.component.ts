import { Component, EventEmitter, inject, OnInit, output, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
 
// PrimeNG
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { CheckboxModule } from 'primeng/checkbox';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { RouterModule } from '@angular/router';
 

@Component({
  selector: 'app-login-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    FloatLabelModule,
    CheckboxModule,
    IconFieldModule,
    InputIconModule,
    RouterModule
],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss'
})

export class LoginFormComponent implements OnInit {
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  submitted = output<{ email: string; password: string }>();

  private fb = inject(FormBuilder);
 
  form = this.fb.group(
    {
      email: this.fb.nonNullable.control('', [Validators.required, Validators.email]),
      password: this.fb.nonNullable.control('', [Validators.required]),

    }
  );
 
  // Atajo para no escribir 'this.form.controls' todo el rato en la plantilla
  get f() {
    return this.form.controls;
  }   

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched(); // enseña errores
      return;
    } else {
      this.submitted.emit(this.form.getRawValue()); // <- envía {email, password}

    }
  }
}
 
 