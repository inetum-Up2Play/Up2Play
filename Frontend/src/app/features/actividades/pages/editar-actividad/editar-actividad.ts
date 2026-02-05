import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ToastModule } from 'primeng/toast';
import { InputIconModule } from 'primeng/inputicon';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { KeyFilterModule } from 'primeng/keyfilter';
import { DatePickerModule } from 'primeng/datepicker';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { MessageService } from 'primeng/api';

import { ActService } from '../../../../core/services/actividad/act-service';
import { Header } from '../../../../core/layout/header/header';
import { ErrorService } from '../../../../core/services/error/error-service';
import { prohibidasValidator } from '../../../../core/validators/palabras-proh.validator';
import { Footer } from '../../../../core/layout/footer/footer';
import { CommonModule } from '@angular/common';
import { IconDeportePipe } from '../../../../shared/pipes/icon-deporte-pipe';


@Component({
  selector: 'app-editar-actividad',
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
  templateUrl: './editar-actividad.html',
  styleUrl: './editar-actividad.scss',
})

export class EditarActividad implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private actService = inject(ActService);
  private messageService = inject(MessageService);
  private router = inject(Router);
  private errorService = inject(ErrorService);

  loading = signal(false);

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

  private extraerHoraDate(fechaIso: string): Date | null {
    if (!fechaIso) return null;

    const d = new Date(fechaIso); // parsea "2025-12-17T18:30:00"
    return new Date(1970, 0, 1, d.getHours(), d.getMinutes(), d.getSeconds());
  }

  private clamp(val: number, min: number, max: number): number {
    return Math.min(Math.max(val, min), max);
  }

  private stepOf(ctrlName: string): number {
    // en caso de querer custom step por control
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

  cancelar() {
    this.actService['router'].navigate(['/actividades']);
  }

  deportes: { name: string }[] = [];
  deporteEscogido: string | undefined;

  niveles: { name: string }[] = [];
  nivelEscogido: string | undefined;

  actividadForm: FormGroup = this.fb.group({
    nombre: ['', [Validators.required, prohibidasValidator()]],
    descripcion: ['', [Validators.required, prohibidasValidator()]],
    fecha: ['', [Validators.required]],
    hora: ['', [Validators.required]],
    ubicacion: ['', [Validators.required, prohibidasValidator()]],
    deporte: ['', [Validators.required]],
    nivel: ['', [Validators.required]], // mapea a tu enum
    estado: ['', [Validators.required]],
    numPersTotales: [0, [Validators.required, Validators.min(1)]],
    precio: [{ value: null, disabled: true }],
  });

  actividadId!: number;
  cargando = false;
  guardando = false;

  private cargarActividad(id: number): void {
    this.cargando = true;
    this.actService.getActividad(id).subscribe({
      next: (act) => {
        // Si el backend envía fecha en ISO, y usas <input type="datetime-local">, transforma:
        this.actividadForm.patchValue({
          nombre: act.nombre,
          descripcion: act.descripcion,
          fecha: new Date(act.fecha),
          hora: this.extraerHoraDate(act.fecha),
          deporte: this.deportes.find((d) => d.name === act.deporte) ?? null,
          nivel:
            this.niveles.find(
              (n) => n.name.toUpperCase() === act.nivel.toUpperCase()
            ) ?? null,
          ubicacion: act.ubicacion,
          estado: act.estado,
          numPersTotales: act.numPersTotales,
          precio: act.precio,
        });

        this.cargando = false;
      },
      error: (codigo) => {
        this.cargando = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: `No se pudo cargar la actividad (${codigo})`,
        });
      },
    });
  }

  ngOnInit(): void {
    this.actividadId = Number(this.route.snapshot.paramMap.get('id'));
    if (!this.actividadId || Number.isNaN(this.actividadId)) {
      this.messageService.add({
        severity: 'warn',
        summary: 'ID inválido',
        detail: 'No se pudo leer el ID de la actividad.',
      });
      return;
    }

    // Inicializar deportes
    this.deportes = [
      { name: 'Ajedrez' },
      { name: 'Artes Marciales' },
      { name: 'Atletismo' },
      { name: 'Badminton' },
      { name: 'Balonmano' },
      { name: 'Basquet' },
      { name: 'Béisbol' },
      { name: 'Billar' },
      { name: 'Boxeo' },
      { name: 'Ciclismo' },
      { name: 'Crossfit' },
      { name: 'Críquet' },
      { name: 'Danza Deportiva' },
      { name: 'Entrenamiento de fuerza' },
      { name: 'Equitación' },
      { name: 'Escalada' },
      { name: 'Esgrima' },
      { name: 'Esquí' },
      { name: 'Fútbol Americano' },
      { name: 'Futbol' },
      { name: 'Frisbee' },
      { name: 'Gimnasia' },
      { name: 'Golf' },
      { name: 'Hockey' },
      { name: 'Lucha Libre' },
      { name: 'Motocross' },
      { name: 'Natación' },
      { name: 'Padel' },
      { name: 'Parkour' },
      { name: 'Patinaje' },
      { name: 'Petanca' },
      { name: 'Ping Pong' },
      { name: 'Piragüismo' },
      { name: 'Remo' },
      { name: 'Rugby' },
      { name: 'Running' },
      { name: 'Senderismo' },
      { name: 'Skateboarding' },
      { name: 'Snowboard' },
      { name: 'Squash' },
      { name: 'Surf' },
      { name: 'Tenis' },
      { name: 'Tiro con Arco' },
      { name: 'Triatlón' },
      { name: 'Voleibol' },
      { name: 'Waterpolo' }
    ];

    this.niveles = [
      { name: 'Iniciado' },
      { name: 'Principiante' },
      { name: 'Intermedio' },
      { name: 'Avanzado' },
      { name: 'Experto' },
    ];

    this.cargarActividad(this.actividadId);
  }

  extraerHora(fecha: string): string {
    if (!fecha) return '';
    return fecha.includes('T') ? fecha.split('T')[1].substring(0, 5) : '';
  }

  extraerFecha(fecha: string): string {
    if (!fecha) return '';
    return fecha.includes('T') ? fecha.split('T')[0] : '';
  }

  onSubmit(): void {
    if (this.actividadForm.invalid) {
      this.actividadForm.markAllAsTouched();
      this.messageService.add({
        severity: 'warn',
        summary: 'Formulario incompleto',
        detail: 'Revisa los campos obligatorios.',
      });
      return;
    }

    this.loading.set(true);
    this.guardando = true;

    const formValue = this.actividadForm.value;

    const raw = this.actividadForm.value;

    // Combinar fecha y hora en formato ISO
    const fechaDate: Date = raw.fecha instanceof Date ? raw.fecha : new Date(raw.fecha);
    const horaDate: Date = raw.hora; // ya es Date

    // Prepara el payload acorde al backend (strings/números/enum names)
    const payload = {
      nombre: formValue.nombre,
      descripcion: formValue.descripcion,
      fecha: this.formatDateTime(fechaDate, horaDate), // formato "yyyy-MM-dd'T'HH:mm:ss"
      ubicacion: formValue.ubicacion,
      deporte: formValue.deporte.name, // convertir objeto a string
      nivel: formValue.nivel.name, // convertir objeto a string
      estado: formValue.estado,
      numPersTotales: formValue.numPersTotales,
      precio: formValue.precio,
    };


    this.actService.editarActividad(this.actividadId, payload).subscribe({
      next: (res) => {
        if (res === true) {
          this.messageService.add({
            severity: 'success',
            summary: 'Guardado',
            detail: 'Actividad actualizada correctamente.',
          });

          this.router.navigate(['/actividades/info-actividad', this.actividadId]);

          this.guardando = false;
        } else {
          const mensaje = this.errorService.getMensajeError(res); // Se traduce el mensaje con el controlErrores.ts
          this.errorService.showError(mensaje);
        }
      },
      error: (codigo) => {
        this.guardando = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: `No se pudo guardar (${codigo})`,
        });
      },
    });
  }

  isInvalid(controlName: string): boolean {
    const control = this.actividadForm.get(controlName);
    return !!(control && control.invalid && control.touched);
  }
}
