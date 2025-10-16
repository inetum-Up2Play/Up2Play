import { Component, EventEmitter, inject, OnInit, output, Output } from '@angular/core';
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
import { RouterModule } from '@angular/router';
 

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
  styleUrl: './verification-form.component.scss'
})

export class VerificationFormComponent implements OnInit {
  private userData = inject(UserDataService);

  email: string | null = null;


  ngOnInit() {

    this.email = this.userData.getEmail();

    console.log('Email para verificar:', this.email);

  }

  submitted = output<{ verification: string }>();

  private fb = inject(FormBuilder);
 
  form = this.fb.group(
    {
      verification: this.fb.nonNullable.control('', [Validators.required]),
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
      this.submitted.emit(this.form.getRawValue()); // <- envía {código}
    }
  }
}
 
 