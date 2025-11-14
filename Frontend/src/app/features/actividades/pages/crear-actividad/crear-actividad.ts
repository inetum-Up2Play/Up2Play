import { Component, inject, OnInit } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { MessageService } from 'primeng/api';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { FloatLabel } from 'primeng/floatlabel';
import { InputIconModule } from 'primeng/inputicon';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { KeyFilterModule } from 'primeng/keyfilter';
import { DatePickerModule } from 'primeng/datepicker';
import { InputNumberModule } from 'primeng/inputnumber';

@Component({
  selector: 'app-crear-actividad',
  imports: [ReactiveFormsModule, DatePickerModule, InputNumberModule, InputTextModule, TextareaModule, ButtonModule, ToastModule, MessageModule, FormsModule, FloatLabel, InputIconModule, SelectModule, KeyFilterModule],
  templateUrl: './crear-actividad.html',
  styleUrl: './crear-actividad.scss'
})
export class CrearActividad {
  messageService = inject(MessageService);

  actividadForm: FormGroup;

  formSubmitted = false;

  private pad2(n: number): string {
    return n < 10 ? `0${n}` : `${n}`;
  }

  private formatFecha(d: Date): string {
    // Resultado: dd-MM-yyyy (sin zonas horarias)
    const day = this.pad2(d.getDate());
    const month = this.pad2(d.getMonth() + 1);
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  }

  private formatHora(d: Date): string {
    // Resultado: HH:mm:ss (24h)
    const hh = this.pad2(d.getHours());
    const mm = this.pad2(d.getMinutes());
    const ss = this.pad2(d.getSeconds());
    return `${hh}:${mm}:${ss}`;
  }


  constructor(private fb: FormBuilder) {
    this.actividadForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      fecha: [null, Validators.required],
      hora: [null, Validators.required],
      ubicacion: ['', Validators.required],
      deporte: [null, Validators.required],
      nivel: [null, Validators.required],
      num_pers_totales: [null, [Validators.required, Validators.min(1)]],
      precio: [0, Validators.required] // valor por defecto
    });
  }

  onSubmit(): void {
    this.formSubmitted = true;

    if (this.actividadForm.invalid) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Formulario inválido',
        detail: 'Revisa los campos marcados.'
      });
      return;
    } else {
      this.messageService.add({
        severity: 'success',
        summary: 'Formulario correcto',
        detail: 'Tu actividad ha sido creada.'
      });
    }

    const raw = this.actividadForm.value;

    // Defensive: asegura que son Date
    const fechaDate: Date = raw.fecha instanceof Date ? raw.fecha : new Date(raw.fecha);
    const horaDate: Date = raw.hora instanceof Date ? raw.hora : new Date(raw.hora);

    const payload = {
      nombre: raw.nombre?.trim(),
      descripcion: raw.descripcion?.trim(),
      fecha: this.formatFecha(fechaDate), // "dd-MM-yyyy"
      hora: this.formatHora(horaDate),    // "HH:mm:ss"
      ubicacion: raw.ubicacion?.trim(),
      deporte: raw.deporte?.name ?? raw.deporte ?? null, // envia string
      nivel: raw.nivel?.name ?? raw.nivel ?? null, // envia string
      num_pers_totales: Number(raw.num_pers_totales), // envia numero
      precio: Number(raw.precio ?? 0)
    };

    console.log('Payload listo para API:', payload);

    // Llamada a servicio
    // this.miServicio.crearActividad(payload).subscribe({
    //   next: () => this.messageService.add({severity:'success', summary:'OK', detail:'Actividad creada'}),
    //   error: (e) => this.messageService.add({severity:'error', summary:'Error', detail:'No se pudo crear'})
    // });
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
    // Inicializar deportes
    this.deportes = [
      { name: 'Arquería' },
      { name: 'Atletismo' },
      { name: 'Balonmano' },
      { name: 'Basquet' },
      { name: 'Béisbol' },
      { name: 'Billar' },
      { name: 'Boxeo' },
      { name: 'Canotaje' },
      { name: 'Críquet' },
      { name: 'Ciclismo' },
      { name: 'Escalada' },
      { name: 'Esgrima' },
      { name: 'Esquí' },
      { name: 'Futbol' },
      { name: 'Gimnasia' },
      { name: 'Golf' },
      { name: 'Hockey' },
      { name: 'Judo' },
      { name: 'Karate' },
      { name: 'Natación' },
      { name: 'Patinaje' },
      { name: 'Ping Pong' },
      { name: 'Rugby' },
      { name: 'Remo' },
      { name: 'Snowboard' },
      { name: 'Softbol' },
      { name: 'Surf' },
      { name: 'Taekwondo' },
      { name: 'Tenis' },
      { name: 'Triatlón' },
      { name: 'Voleibol' },
      { name: 'Waterpolo' },
      { name: 'Ajedrez' },
      { name: 'Badminton' },
      { name: 'Boxeo Tailandés' },
      { name: 'Capoeira' },
      { name: 'Crossfit' },
      { name: 'Danza Deportiva' },
      { name: 'Equitación' },
      { name: 'Fútbol Americano' },
      { name: 'Kickboxing' },
      { name: 'Lucha Libre' },
      { name: 'Motocross' },
      { name: 'Padel' },
      { name: 'Parkour' },
      { name: 'Pesas' },
      { name: 'Raquetbol' },
      { name: 'Skateboarding' },
      { name: 'Squash' },
      { name: 'Tiro con Arco' },
      { name: 'Ultimate Frisbee' }
    ];
    this.niveles = [
      { name: 'Iniciado' },
      { name: 'Principiante' },
      { name: 'Intermedio' },
      { name: 'Avanzado' },
      { name: 'Experto' }
    ];
  }
}