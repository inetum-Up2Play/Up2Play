import { Component, effect, input, output, inject, model } from '@angular/core';
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
import { DialogModule } from 'primeng/dialog';

type SexoEnum = 'MASCULINO' | 'FEMENINO' | 'OTRO'; // ajusta a tu enum real

interface SexoOption { label: string; value: SexoEnum; }

export interface CambiarPasswordDto {
  oldPassword: string;
  newPassword: string;
}


@Component({
  selector: 'app-form-profile',
  imports: [DialogModule, ToastModule, MultiSelectModule, ReactiveFormsModule, InputTextModule, ButtonModule, FormsModule, SelectModule, DatePicker, InputNumberModule, MessageModule, InputIconModule, IconFieldModule, CommonModule],
  templateUrl: './form-profile.html',
  styleUrl: './form-profile.scss'
})
export class FormProfile {
  /** Visibilidad del diálogo (two-way con model()) */
  passwordDialogVisible = model<boolean>(false);

  /** Evento para que el padre llame al servicio de cambiar contraseña */
  changePassword = output<CambiarPasswordDto>();

  /** Datos que vienen del padre (signals) */
  usuario = input<Usuario | null>(null);
  perfil = input<Perfil | null>(null);

  /** Evento de cambios de perfil hacia el padre */
  cambiosPerfil = output<Perfil>();

  // ====== Estado local ======
  loading = false;

  // ====== Formularios ======
  formulario!: FormGroup;
  pwdForm!: FormGroup;

  // ====== Inyecciones ======
  private fb = inject(FormBuilder);
  private messageService = inject(MessageService);

  // ====== Datos auxiliares ======
  readonly sexos: SexoOption[] = [
    { label: 'Masculino', value: 'MASCULINO' },
    { label: 'Femenino', value: 'FEMENINO' },
    { label: 'Otro', value: 'OTRO' },
  ];

  groupedCities: SelectItemGroup[] = [
    {
      label: 'Alemania',
      value: 'de',
      items: [
        { label: 'Alemán', value: 'German' },
      ]
    },
    {
      label: 'USA',
      value: 'us',
      items: [
        { label: 'Inglés', value: 'English' },
        { label: 'Español', value: 'Spanish' }
      ]
    },
    {
      label: 'Japón',
      value: 'jp',
      items: [
        { label: 'Japonés', value: 'Japanese' }
      ]
    },
    {
      label: 'España',
      value: 'es',
      items: [
        { label: 'Español', value: 'Spanish' },
        { label: 'Catalán', value: 'Catalan' },
        { label: 'Gallego', value: 'Galician' },
        { label: 'Basco', value: 'Basque' }
      ]
    },
    {
      label: 'Francia',
      value: 'fr',
      items: [
        { label: 'Francés', value: 'French' }
      ]
    },
    {
      label: 'Canadá',
      value: 'ca',
      items: [
        { label: 'Inglés', value: 'English' },
        { label: 'Francés', value: 'French' }
      ]
    },
    {
      label: 'India',
      value: 'in',
      items: [
        { label: 'Hindi', value: 'Hindi' },
        { label: 'Bengalí', value: 'Bengali' },
        { label: 'Tamil', value: 'Tamil' }
      ]
    },
    {
      label: 'Brazil',
      value: 'br',
      items: [
        { label: 'Portugués', value: 'Portuguese' }
      ]
    },
    {
      label: 'China',
      value: 'cn',
      items: [
        { label: 'Mandarin', value: 'Mandarin' },
        { label: 'Cantonés', value: 'Cantonese' }
      ]
    },
    {
      label: 'Rusia',
      value: 'ru',
      items: [
        { label: 'Ruso', value: 'Russian' }
      ]
    }
  ];


  // ====== Ciclo de vida ======
  ngOnInit(): void {
    // Form principal
    this.formulario = this.fb.group({
      nombre: ['', Validators.required],
      apellidos: ['', Validators.required],
      idiomas: [[]],
      telefono: ['', [Validators.pattern(/[0-9+\-\s]/)]],
      fechaNacimiento: [null as Date | null],
      sexo: [null as SexoEnum | null],
      email: [{ value: '', disabled: true }, [Validators.email]],
      // Campo “falso” para mostrar que la contraseña se edita desde el diálogo
      password: [{ value: '********' }]
    });

    // Form del diálogo de contraseña
    this.pwdForm = this.fb.group({
      oldPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      repeatPassword: ['', [Validators.required]]
    }, { validators: this.passwordsIgualesValidator });

  }

  // ====== Efecto de sincronización con inputs signal ======
  private readonly syncInputsEffect = effect(() => {
    const u = this.usuario();
    const p = this.perfil();
    if (!this.formulario || !p) return;

    const fechaUI: Date | null = p.fechaNacimiento
      ? new Date(p.fechaNacimiento as any) // ajusta si backend envía string
      : null;

    const idiomas = Array.isArray(p.idiomas)
      ? p.idiomas
      : (typeof p.idiomas === 'string'
        ? p.idiomas.split(',').map(s => s.trim()).filter(Boolean)
        : []);

    const current = this.formulario.getRawValue();

    this.formulario.patchValue({
      nombre: current.nombre || (p as any).nombre || '',
      apellidos: current.apellidos || (p as any).apellido || '',
      idiomas: (current.idiomas && current.idiomas.length) ? current.idiomas : idiomas,
      telefono: current.telefono || (p as any).telefono || '',
      fechaNacimiento: fechaUI,
      sexo: current.sexo ?? ((p as any).sexo ?? null),
      email: u?.email ?? '',
      password: '********',
    }, { emitEvent: false });

    this.formulario.get('email')?.disable({ emitEvent: false });
  });

  // ====== Validadores ======
  private passwordsIgualesValidator(group: FormGroup) {
    const newPwd = group.get('newPassword')?.value;
    const repeatPwd = group.get('repeatPassword')?.value;
    return newPwd === repeatPwd ? null : { passwordsNoCoinciden: true };
  }

  // ====== Diálogo contraseña ======
  showDialog() {
    this.passwordDialogVisible.set(true);
  }

  closeDialog() {
    this.passwordDialogVisible.set(false);
  }

  onSubmitPassword() {
    if (this.pwdForm.invalid) {
      this.pwdForm.markAllAsTouched();
      return;
    }
    const payload: CambiarPasswordDto = {
      oldPassword: this.pwdForm.value.oldPassword,
      newPassword: this.pwdForm.value.newPassword
    };
    this.loading = true;
    // Emitimos al padre; él hace la llamada HTTP
    this.changePassword.emit(payload);
  }

  /** Llamado por el padre cuando terminó la petición */
  onRequestFinished(success: boolean) {
    this.loading = false;
    if (success) {
      this.closeDialog();
      this.pwdForm.reset();
    }
  }

  // ====== Submit del formulario principal ======
  onSubmit(): void {
    if (this.formulario.invalid) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Formulario inválido',
        detail: 'Por favor, rellene los campos obligatorios'
      });
      this.formulario.markAllAsTouched();
      return;
    }

    const raw = this.formulario.getRawValue(); // incluye disabled
    const original = this.perfil();
    const u = this.usuario();
    if (!original) return;

    const actualizado: Perfil = {
      ...original,
      nombre: raw.nombre,
      apellido: raw.apellidos,
      telefono: raw.telefono,
      sexo: (raw.sexo ?? null) as SexoEnum | null,
      fechaNacimiento: raw.fechaNacimiento ?? null,
      idiomas: Array.isArray(raw.idiomas) ? raw.idiomas.join(',') : '',
      id_usuario: (original as any).id_usuario ?? u?.id ?? (original as any).id_usuario,
    };

    this.cambiosPerfil.emit(actualizado);
  }

  // Utilidad opcional si necesitas formatear fechas a 'yyyy-MM-dd'
  private toLocalDateString(d: Date): string {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}

