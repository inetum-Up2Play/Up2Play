import { Component, inject, OnInit, signal } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { MessageService } from 'primeng/api';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { InputIconModule } from 'primeng/inputicon';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { KeyFilterModule } from 'primeng/keyfilter';
import { DatePickerModule } from 'primeng/datepicker';
import { InputNumberModule } from 'primeng/inputnumber';

import { ActService } from '../../../../core/services/actividad/act-service';
import { Header } from '../../../../core/layout/header/header';
import { ErrorService } from '../../../../core/services/error/error-service';
import { prohibidasValidator } from '../../../../core/validators/palabras-proh.validator';
import { Footer } from '../../../../core/layout/footer/footer';
import { UserService } from '../../../../core/services/user/user-service';

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
  ],
  templateUrl: './crear-actividad.html',
  styleUrl: './crear-actividad.scss',
})
export class CrearActividad {
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
      numPersTotales: [null, [Validators.required, Validators.min(1)]],
      precio: [0, Validators.required], // valor por defecto
    });
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

    // Defensive: asegura que son Date
    const fechaDate: Date =
      raw.fecha instanceof Date ? raw.fecha : new Date(raw.fecha);
    const horaDate: Date =
      raw.hora instanceof Date ? raw.hora : new Date(raw.hora);

    const payload = {
      nombre: raw.nombre?.trim(),
      descripcion: raw.descripcion?.trim(),
      fecha: this.formatDateTime(fechaDate, horaDate), // <-- único campo combinado
      ubicacion: raw.ubicacion?.trim(),
      deporte: raw.deporte?.name ?? raw.deporte ?? null, // envia string
      nivel: raw.nivel?.name ?? raw.nivel ?? null, // envia string
      numPersTotales: Number(raw.numPersTotales), // envia numero
      precio: Number(raw.precio ?? 0),
    };

    console.log('Payload listo para API:', payload);

    // Llamada a servicio
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
          }, 1500); // espera 1.5 segundos para que se vea el toast
        } else {
          const mensaje = this.errorService.getMensajeError(res); // Se traduce el mensaje con el controlErrores.ts
          this.errorService.showError(mensaje); // Se muestra con PrimeNG
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

  isInvalid(controlName: string): boolean {
    const control = this.actividadForm.get(controlName);
    return !!(control && control.invalid && control.touched);
  }

  deportes: any[] | undefined;
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
        console.log(user);
      }
    });

    // Inicializar deportes
    this.deportes = [
      { name: 'Atletismo' },
      { name: 'Balonmano' },
      { name: 'Basquet' },
      { name: 'Béisbol' },
      { name: 'Billar' },
      { name: 'Boxeo' },
      { name: 'Críquet' },
      { name: 'Ciclismo' },
      { name: 'Escalada' },
      { name: 'Esgrima' },
      { name: 'Esquí' },
      { name: 'Futbol' },
      { name: 'Gimnasia' },
      { name: 'Golf' },
      { name: 'Hockey' },
      { name: 'Artes Marciales' },
      { name: 'Natación' },
      { name: 'Patinaje' },
      { name: 'Ping Pong' },
      { name: 'Piragüismo' },
      { name: 'Rugby' },
      { name: 'Remo' },
      { name: 'Snowboard' },
      { name: 'Surf' },
      { name: 'Tenis' },
      { name: 'Triatlón' },
      { name: 'Voleibol' },
      { name: 'Waterpolo' },
      { name: 'Ajedrez' },
      { name: 'Badminton' },
      { name: 'Crossfit' },
      { name: 'Danza Deportiva' },
      { name: 'Entrenamiento de fuerza' },
      { name: 'Equitación' },
      { name: 'Fútbol Americano' },
      { name: 'Lucha Libre' },
      { name: 'Motocross' },
      { name: 'Padel' },
      { name: 'Parkour' },
      { name: 'Skateboarding' },
      { name: 'Squash' },
      { name: 'Tiro con Arco' },
      { name: 'Frisbee' },
      { name: 'Senderismo' },
      { name: 'Running' },
      { name: 'Petanca' },
    ];
    this.niveles = [
      { name: 'Iniciado' },
      { name: 'Principiante' },
      { name: 'Intermedio' },
      { name: 'Avanzado' },
      { name: 'Experto' },
    ];
  }
}
