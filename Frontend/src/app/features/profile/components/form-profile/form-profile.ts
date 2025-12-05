import { Component, effect, input, output } from '@angular/core';
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
import { MultiSelectModule } from 'primeng/multiselect';
import { CommonModule } from '@angular/common';
import { Usuario } from '../../../../shared/models/usuario.model';
import { Perfil } from '../../../../shared/models/Perfil';
import { Profile } from '../../pages/profile/profile';

interface Sexo {
  name: string;
}

@Component({
  selector: 'app-form-profile',
  imports: [MultiSelectModule ,ReactiveFormsModule, InputTextModule, ButtonModule, FormsModule, SelectModule, DatePicker, InputNumberModule, MessageModule, InputIconModule, IconFieldModule, CommonModule],
  templateUrl: './form-profile.html',
  styleUrl: './form-profile.scss'
})
export class FormProfile {

  // Recibe datos del padre
  usuario = input<Usuario | null>(null);
  perfil  = input<Perfil  | null>(null);

  // Envia dades al pare
  cambiosPerfil  = output<Perfil>();

  // Has de posar tots els camps al perfil al nouPerfil, el id, es posa el mateix que hi havia
  //   id: number;
  // nombre: string;
  // apellido: string;
  // imagen?: number;
  // telefono: number;
  // sexo: string;
  // fecha_nac: Date;
  // idiomas: string;
  // id_usuario: number;
  
/*
  enviarPerfil(formValues: any) {
    const nuevoPerfil: Perfil = {
      id: this.usuario()?.id ?? 0, // o lo que corresponda
      nombre: formValues.nombre,
      contraseña: formValues.contraseña,
      rol: formValues.rol,
      nombre_usuario: formValues.nombre_usuario,
    };


    this.cambiosPerfil.emit(nuevoPerfil);
  }
    */



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

  // Se ejecuta en injection context
  readonly syncUsuarioEffect = effect(() => {
    const u = this.usuario();           // lee la signal del input
    if (!u || !this.formulario) return; // protege si aún no existe el form

    // Rellena y asegura disabled
    this.formulario.patchValue({
      email: u.email,
      password: '********',
    }, { emitEvent: false });

    this.formulario.get('email')?.disable({ emitEvent: false });
    this.formulario.get('password')?.disable({ emitEvent: false });
  });


  ngOnInit(): void {
    this.formulario = this.fb.group({
      nombre: ['', Validators.required],
      apellidos: ['', Validators.required],
      idiomas: [''],
      telefono: ['', [Validators.pattern(/[0-9+\-\s]/)]],
      fechaNacimiento: [''],
      sexo: [''],
      email: [{ value: '', disabled: true }, [Validators.email]],
      password: [{ value: '', disabled: true }, Validators.required]
    });

    this.sexos = [
      { name: 'Masculino' },
      { name: 'Femenino' },
      { name: 'Otro' },
    ];

  }

  onSubmit(): void {
    if (this.formulario.valid) {
      const payload = this.formulario.getRawValue();
      console.log('Datos del formulario:', payload);
      // llamar a tu servicio para enviar los datos al backend
    } else {
      console.log('Formulario inválido');
      this.formulario.markAllAsTouched(); // Marca todos los campos para mostrar errores
    }
  }
}
