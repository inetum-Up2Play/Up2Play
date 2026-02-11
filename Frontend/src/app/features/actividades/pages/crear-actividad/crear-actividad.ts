// Angular
import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

// PrimeNG
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { InputIconModule } from 'primeng/inputicon';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { KeyFilterModule } from 'primeng/keyfilter';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';

// App (layout, servicios, validadores, pipes, utils)
import { Footer } from '../../../../core/layout/footer/footer';
import { Header } from '../../../../core/layout/header/header';

import { ActService } from '../../../../core/services/actividad/act-service';
import { ErrorService } from '../../../../core/services/error/error-service';
import { UserService } from '../../../../core/services/user/user-service';

import { prohibidasValidator } from '../../../../core/validators/palabras-proh.validator';

import { IconDeportePipe } from '../../../../shared/pipes/icon-deporte-pipe';

import { DEPORTES, Opcion } from '../../../../core/utils/deportes.constant';
import { NIVELES } from '../../../../core/utils/niveles.constant';

@Component({
  selector: 'app-crear-actividad',
  imports: [
    Header,
    Footer,
    ReactiveFormsModule,
    DatePickerModule,
    InputNumberModule,
    InputTextModule,
    TextareaModule,
    ButtonModule,
    ToastModule,
    MessageModule,
    FormsModule,
    InputIconModule,
    SelectModule,
    KeyFilterModule,
    CommonModule,
    IconDeportePipe
  ],
  templateUrl: './crear-actividad.html',
  styleUrl: './crear-actividad.scss',
})

export class CrearActividad implements OnInit {
  private messageService = inject(MessageService);
  private actService = inject(ActService);
  private errorService = inject(ErrorService);
  private userService = inject(UserService);

  actividadForm: FormGroup;
  formSubmitted = false;
  pagosHabilitados = signal(false);

  private pad2(n: number): string {
    return n < 10 ? `0${n}` : `${n}`;
  }

  private formatDateTime(fecha: Date, hora: Date): string {
    const year = fecha.getFullYear();
    const month = this.pad2(fecha.getMonth() + 1);
    const day = this.pad2(fecha.getDate());

    const hh = this.pad2(hora.getHours());
    const mm = this.pad2(hora.getMinutes());
    const ss = this.pad2(hora.getSeconds());

    // Resultado: YYYY-MM-DDThh:mm:ss
    return `${year}-${month}-${day}T${hh}:${mm}:${ss}`;
  }

  constructor(private fb: FormBuilder) {
    this.actividadForm = this.fb.group({
      nombre: ['', [Validators.required, prohibidasValidator()]],
      descripcion: ['', [Validators.required, prohibidasValidator()]],
      fecha: [null, Validators.required],
      hora: [null, Validators.required],
      ubicacion: ['', [Validators.required, prohibidasValidator()]],
      deporte: [null, Validators.required],
      nivel: [null, Validators.required],
      numPersTotales: [1, [Validators.required, Validators.min(1), Validators.max(999)]],
      precio: [0, Validators.required],
    });
  }


  private clamp(val: number, min: number, max: number): number {
    return Math.min(Math.max(val, min), max);
  }

  private stepOf(ctrlName: string): number {
    return 1;
  }

  getCtrl(ctrlName: string) {
    return this.actividadForm.get(ctrlName)!;
  }

  isAtMin(ctrlName: string): boolean {
    const c = this.getCtrl(ctrlName);
    const min = 1;
    return (Number(c.value) || 0) <= min;
  }

  isAtMax(ctrlName: string): boolean {
    const c = this.getCtrl(ctrlName);
    const max = 999;
    return (Number(c.value) || 0) >= max;
  }

  increment(ctrlName: string): void {
    const c = this.getCtrl(ctrlName);
    const min = 1, max = 999, step = this.stepOf(ctrlName);
    const current = Number(c.value) || 0;
    const next = this.clamp(current + step, min, max);
    c.setValue(next);
    c.markAsDirty();
    c.updateValueAndValidity({ onlySelf: true, emitEvent: true });
  }

  decrement(ctrlName: string): void {
    const c = this.getCtrl(ctrlName);
    const min = 1, max = 999, step = this.stepOf(ctrlName);
    const current = Number(c.value) || 0;
    const next = this.clamp(current - step, min, max);
    c.setValue(next);
    c.markAsDirty();
    c.updateValueAndValidity({ onlySelf: true, emitEvent: true });
  }

  get descripcionLength(): number {
    return (this.actividadForm.get('descripcion')?.value?.length ?? 0);
  }

  onSubmit(): void {
    this.formSubmitted = true;
    const raw = this.actividadForm.value;
    const precio = Number(raw.precio ?? 0);

    if (precio > 0 && !this.pagosHabilitados()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Pagos no configurados',
        detail: 'Debes habilitar los pagos en tu perfil para crear actividades con coste.',
      });
      return; // Detenemos la ejecución aquí
    }

    if (this.actividadForm.invalid) {
      // Marca todos los controles como tocados → dispara validaciones en la vista
      Object.keys(this.actividadForm.controls).forEach((key) => {
        const control = this.actividadForm.get(key);
        control?.markAsTouched();
        control?.updateValueAndValidity();
      });

      this.messageService.add({
        severity: 'warn',
        summary: 'Formulario inválido',
        detail: 'Revisa los campos marcados.',
      });
      return;
    }

    // asegura que son Date
    const fechaDate: Date =
      raw.fecha instanceof Date ? raw.fecha : new Date(raw.fecha);
    const horaDate: Date =
      raw.hora instanceof Date ? raw.hora : new Date(raw.hora);

    const payload = {
      nombre: raw.nombre?.trim(),
      descripcion: raw.descripcion?.trim(),
      fecha: this.formatDateTime(fechaDate, horaDate), // campo combinado
      ubicacion: raw.ubicacion?.trim(),
      deporte: raw.deporte?.label ?? raw.deporte ?? null,
      nivel: raw.nivel?.name ?? raw.nivel ?? null, // envia string
      numPersTotales: Number(raw.numPersTotales), // envia numero
      precio: Number(raw.precio ?? 0),
    };


    // LLAMADA AL SERVICIO CREAR ACTIVIDAD 
    this.actService.crearActividad(payload).subscribe({
      next: (res) => {
        if (res === true) {
          this.messageService.add({
            severity: 'success',
            summary: 'OK',
            detail: 'Actividad creada',
          });

          // Vaciar formulario
          this.actividadForm.reset();
          this.formSubmitted = false;

          // Redirigir a la lista de actividades
          setTimeout(() => {
            this.actService['router'].navigate(['/actividades']);
          }, 1500);
        } else {
          const mensaje = this.errorService.getMensajeError(res);
          this.errorService.showError(mensaje);
        }
      },

      error: (e) =>
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo crear',
        }),
    });
  }

  cancelar() {
    this.actService['router'].navigate(['/actividades']);
  }

  isInvalid(controlName: string): boolean {
    const control = this.actividadForm.get(controlName);
    return !!(control && control.invalid && control.touched);
  }

  deportes: Opcion[] = [];
  deporteEscogido: string | undefined;

  fecha: Date | undefined;
  hora: Date[] | undefined;

  niveles: any[] | undefined;
  nivelEscogido: string | undefined;

  ngOnInit() {
    // Cargamos el estado del usuario
    this.userService.getUsuario().subscribe({
      next: (user) => {
        this.pagosHabilitados.set(user?.pagosHabilitados ?? false);
      }
    });

    // Inicializar JSON deportes
    this.deportes = DEPORTES;

    this.niveles = NIVELES;
  }
}
