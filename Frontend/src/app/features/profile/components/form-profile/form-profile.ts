import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { MessageService, SelectItemGroup } from 'primeng/api';
import { DatePicker } from 'primeng/datepicker';
import { InputNumberModule } from 'primeng/inputnumber';
import { MessageModule } from 'primeng/message';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { CommonModule } from '@angular/common';

interface Sexo {
  name: string;
}

@Component({
  selector: 'app-form-profile',
  imports: [ReactiveFormsModule, InputTextModule, ButtonModule, FormsModule, SelectModule, DatePicker, InputNumberModule, MessageModule, InputIconModule, IconFieldModule, CommonModule],
  templateUrl: './form-profile.html',
  styleUrl: './form-profile.scss'
})
export class FormProfile {
  sexos: Sexo[] | undefined;
  sexoSeleccionado: Sexo | undefined;

  date: Date | undefined;

  groupedCities: SelectItemGroup[];
  selectedCity: string | undefined;

  formulario!: FormGroup;

  constructor(private fb: FormBuilder) {
    this.groupedCities = [
      {
        label: 'Germany',
        value: 'de',
        items: [
          { label: 'German', value: 'German' },
        ]
      },
      {
        label: 'USA',
        value: 'us',
        items: [
          { label: 'English', value: 'English' },
          { label: 'Spanish', value: 'Spanish' }
        ]
      },
      {
        label: 'Japan',
        value: 'jp',
        items: [
          { label: 'Japanese', value: 'Japanese' }
        ]
      },
      {
        label: 'Spain',
        value: 'es',
        items: [
          { label: 'Spanish', value: 'Spanish' },
          { label: 'Catalan', value: 'Catalan' },
          { label: 'Galician', value: 'Galician' },
          { label: 'Basque', value: 'Basque' }
        ]
      },
      {
        label: 'France',
        value: 'fr',
        items: [
          { label: 'French', value: 'French' }
        ]
      },
      {
        label: 'Canada',
        value: 'ca',
        items: [
          { label: 'English', value: 'English' },
          { label: 'French', value: 'French' }
        ]
      },
      {
        label: 'India',
        value: 'in',
        items: [
          { label: 'Hindi', value: 'Hindi' },
          { label: 'English', value: 'English' },
          { label: 'Bengali', value: 'Bengali' },
          { label: 'Tamil', value: 'Tamil' }
        ]
      },
      {
        label: 'Brazil',
        value: 'br',
        items: [
          { label: 'Portuguese', value: 'Portuguese' }
        ]
      },
      {
        label: 'China',
        value: 'cn',
        items: [
          { label: 'Mandarin', value: 'Mandarin' },
          { label: 'Cantonese', value: 'Cantonese' }
        ]
      },
      {
        label: 'Russia',
        value: 'ru',
        items: [
          { label: 'Russian', value: 'Russian' }
        ]
      }
    ];

  }

  ngOnInit(): void {
    this.formulario = this.fb.group({
      nombre: ['', Validators.required],
      apellidos: ['', Validators.required],
      idiomas: [''],
      telefono: ['', [Validators.pattern(/[0-9+\-\s]/)]],
      fechaNacimiento: [''],
      sexo: [''],
      email: ['', [Validators.email]],
      password: ['', Validators.required]
    });

    this.sexos = [
      { name: 'Masculino' },
      { name: 'Femenino' },
      { name: 'Otro' },
      { name: 'Prefiero no decirlo' },
    ];
  }

  onSubmit(): void {
    if (this.formulario.valid) {
      console.log('✅ Datos del formulario:', this.formulario.value);
      // llamar a tu servicio para enviar los datos al backend
    } else {
      console.log('❌ Formulario inválido');
      this.formulario.markAllAsTouched(); // Marca todos los campos para mostrar errores
    }
  }
}
