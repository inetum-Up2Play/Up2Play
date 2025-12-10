import { Component, effect, input, output, inject } from '@angular/core';
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
import { ToastModule } from 'primeng/toast';

type SexoEnum = 'MASCULINO' | 'FEMENINO' | 'OTRO'; // ajusta a tu enum real


interface SexoOption { label: string; value: SexoEnum; }


@Component({
  selector: 'app-form-profile',
  imports: [ToastModule, MultiSelectModule, ReactiveFormsModule, InputTextModule, ButtonModule, FormsModule, SelectModule, DatePicker, InputNumberModule, MessageModule, InputIconModule, IconFieldModule, CommonModule],
  templateUrl: './form-profile.html',
  styleUrl: './form-profile.scss'
})
export class FormProfile {

  private messageService = inject(MessageService);

  // Opciones del select de sexo (valor debe coincidir con el enum del backend)
  readonly sexos: SexoOption[] = [
    { label: 'Masculino', value: 'MASCULINO' },
    { label: 'Femenino', value: 'FEMENINO' },
    { label: 'Otro', value: 'OTRO' },
  ];


  // Recibe datos del padre
  usuario = input<Usuario | null>(null);
  perfil = input<Perfil | null>(null);

  // Envia dades al pare
  cambiosPerfil = output<Perfil>();

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
      idiomas: [[]],
      telefono: ['', [Validators.pattern(/[0-9+\-\s]/)]],
      fechaNacimiento: [null as Date | null],
      sexo: [null],
      email: [{ value: '', disabled: true }, [Validators.email]],
      password: [{ value: '', disabled: true }, Validators.required]
    });

  }

  // Se ejecuta en injection context
  readonly syncInputsEffect = effect(() => {
    const u = this.usuario();           // lee la signal del input
    const p = this.perfil();
    if (!this.formulario || !p) return; // protege si aún no existe el form

    // Conversión de tipos si viene del backend:

    const fechaUI: Date | null = p.fechaNacimiento
      ? new Date(p.fechaNacimiento)  // ← usa el nombre correcto del backend
      : null;
    const idiomas = Array.isArray(p.idiomas)
      ? p.idiomas
      : (typeof p.idiomas === 'string' ? p.idiomas.split(',').map(s => s.trim()).filter(Boolean) : []);


    const current = this.formulario.getRawValue();

    this.formulario.patchValue({
      nombre: current.nombre ? current.nombre : (p.nombre ?? ''),
      apellidos: current.apellidos ? current.apellidos : (p.apellido ?? ''),
      idiomas: current.idiomas?.length ? current.idiomas : idiomas,
      telefono: current.telefono ? current.telefono : (p.telefono ?? ''),
      fechaNacimiento: fechaUI,
      // sexo debe ser NULL o un valor válido del enum
      sexo: current.sexo ?? (p.sexo ?? null),
      email: u?.email ?? '',
      password: '********',
    }, { emitEvent: false });
    ;

    this.formulario.get('email')?.disable({ emitEvent: false });
    this.formulario.get('password')?.disable({ emitEvent: false });
  });



  /** Submit: construye el payload con los cambios y lo emite al padre */
  onSubmit(): void {
    if (this.formulario.invalid) {
      this.messageService.add({ severity: 'warn', summary: 'Formulario invalido', detail: 'Porfavor, rellene los campos obligatorios' });
      this.formulario.markAllAsTouched();
      return;
    }

    const raw = this.formulario.getRawValue(); // incluye disabled
    const original = this.perfil();
    const u = this.usuario();
    if (!original) return;

    const sexo: SexoEnum | null = raw.sexo ?? null; // nunca ''
    const fecha_nac = raw.fechaNacimiento
      ? this.toLocalDateString(raw.fechaNacimiento)  // <- clave
      : null;


    const actualizado: Perfil = {
      // Conserva lo que no edita el form
      ...original,

      // Campos editables del form
      nombre: raw.nombre,
      apellido: raw.apellidos,
      telefono: (raw.telefono),
      sexo,
      fechaNacimiento: raw.fechaNacimiento ?? null,
      idiomas: Array.isArray(raw.idiomas) ? raw.idiomas.join(',') : '',

      // Asegura relación con usuario si aplica
      id_usuario: original.id_usuario ?? u?.id ?? original.id_usuario,
    };

    this.cambiosPerfil.emit(actualizado);
  }

  private toLocalDateString(d: Date): string {
    // Formatea a 'yyyy-MM-dd' en la zona local del usuario, sin hora ni zona.
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

}
