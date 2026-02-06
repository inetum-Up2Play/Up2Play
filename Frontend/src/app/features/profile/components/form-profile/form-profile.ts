// Angular
import { CommonModule } from '@angular/common';
import { Component, effect, inject, input, model, output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

// PrimeNG
import { MessageService, SelectItemGroup } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DatePicker } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';

// App (modelos, validadores, utilidades)
import { Usuario } from '../../../../shared/models/usuario.model';
import { Perfil } from '../../../../shared/models/Perfil';
import { prohibidasValidator } from '../../../../core/validators/palabras-proh.validator';
import { LANGUAGE_GROUPS } from '../../../../core/utils/languages.constant';

type SexoEnum = 'MASCULINO' | 'FEMENINO' | 'OTRO';

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
  passwordDialogVisible = model<boolean>(false);

  changePassword = output<CambiarPasswordDto>();

  usuario = input<Usuario | null>(null);
  perfil = input<Perfil | null>(null);

  cambiosPerfil = output<Perfil>();

  loading = false;

  formulario!: FormGroup;
  pwdForm!: FormGroup;

  private fb = inject(FormBuilder);
  private messageService = inject(MessageService);

  readonly sexos: SexoOption[] = [
    { label: 'Masculino', value: 'MASCULINO' },
    { label: 'Femenino', value: 'FEMENINO' },
    { label: 'Otro', value: 'OTRO' },
  ];

  // ===== Json con idiomas =====
  groupedLanguages = LANGUAGE_GROUPS;

  ngOnInit(): void {
    this.formulario = this.fb.group({
      nombre: ['', [Validators.required, prohibidasValidator()]],
      apellidos: ['', [Validators.required, prohibidasValidator()]],
      idiomas: [[]],
      telefono: ['', [Validators.pattern(/[0-9+\-\s]/)]],
      fechaNacimiento: [null as Date | null],
      sexo: [null as SexoEnum | null],
      email: [{ value: '', disabled: true }, [Validators.email, prohibidasValidator()]],
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

  private readonly syncInputsEffect = effect(() => {
    const u = this.usuario();
    const p = this.perfil();
    if (!this.formulario || !p) return;

    const fechaUI: Date | null = p.fechaNacimiento
      ? new Date(p.fechaNacimiento as any)
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
      fechaNacimiento: current.fechaNacimiento ?? fechaUI,
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
    this.changePassword.emit(payload);
  }

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

    const raw = this.formulario.getRawValue();
    const original = this.perfil();
    const u = this.usuario();
    if (!original) return;

    const actualizado: Perfil = {
      ...original,
      nombre: raw.nombre,
      apellido: raw.apellidos,
      telefono: raw.telefono,
      sexo: (raw.sexo ?? null) as SexoEnum | null,
      fechaNacimiento:
        raw.fechaNacimiento
          ? this.toLocalDateString(raw.fechaNacimiento)
          : null,

      idiomas: Array.isArray(raw.idiomas) ? raw.idiomas.join(',') : '',
      id_usuario: (original as any).id_usuario ?? u?.id ?? (original as any).id_usuario,
    };

    this.cambiosPerfil.emit(actualizado);
  }

  // Utilidad formatear fechas a 'yyyy-MM-dd'
  private toLocalDateString(d: Date): string {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}

