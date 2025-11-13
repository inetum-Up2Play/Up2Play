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

@Component({
  selector: 'app-crear-actividad',
  imports: [ReactiveFormsModule, DatePickerModule, InputTextModule, TextareaModule, ButtonModule, ToastModule, MessageModule, FormsModule, FloatLabel, InputIconModule, SelectModule, KeyFilterModule],
  templateUrl: './crear-actividad.html',
  styleUrl: './crear-actividad.scss'
})
export class CrearActividad {
  messageService = inject(MessageService);

  actividadForm: FormGroup;

  formSubmitted = false;

  constructor(private fb: FormBuilder) {
    this.actividadForm = this.fb.group({
      título: ['', Validators.required],
      descripción: ['', Validators.required],
      selectedDate: ['', Validators.required]
    });
  }

  onSubmit() {
    this.formSubmitted = true;
    if (this.actividadForm.valid) {
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Form Submitted', life: 3000 });
      this.actividadForm.reset();
      this.formSubmitted = false;
    }
  }

  isInvalid(controlName: string) {
    const control = this.actividadForm.get(controlName);
    return control?.invalid && (control.touched || this.formSubmitted);
  }

  deportes: any[] | undefined;
  deporteEscogido: string | undefined;

  date: Date | undefined;

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
  }
}