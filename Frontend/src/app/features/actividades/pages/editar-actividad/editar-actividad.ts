import { Component, inject, OnInit } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { MessageService } from 'primeng/api';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { InputIconModule } from 'primeng/inputicon';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { KeyFilterModule } from 'primeng/keyfilter';
import { DatePickerModule } from 'primeng/datepicker';
import { InputNumberModule } from 'primeng/inputnumber';
import { ActService } from '../../../../core/services/actividad/act-service';
import { Header } from '../../../../core/layout/header/header';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-editar-actividad',
  imports: [Header, ReactiveFormsModule, DatePickerModule, InputNumberModule, InputTextModule, TextareaModule, ButtonModule, ToastModule, MessageModule, FormsModule, InputIconModule, SelectModule, KeyFilterModule],
  templateUrl: './editar-actividad.html',
  styleUrl: './editar-actividad.scss'
})
export class EditarActividad {

  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private actService = inject(ActService);
  private messageService = inject(MessageService);

  deportes: { name: string }[] = [];
  deporteEscogido: string | undefined;

  niveles: { name: string }[] = [];
  nivelEscogido: string | undefined;


  actividadForm: FormGroup = this.fb.group({
    nombre: ['', [Validators.required, Validators.maxLength(120)]],
    descripcion: ['', [Validators.required, Validators.maxLength(4000)]],
    fecha: ['', [Validators.required]],
    hora: ['', [Validators.required]],
    ubicacion: ['', [Validators.required, Validators.maxLength(200)]],
    deporte: ['', [Validators.required]],
    nivel: ['', [Validators.required]],        // mapea a tu enum
    estado: ['', [Validators.required]],
    numPersTotales: [0, [Validators.required, Validators.min(1)]],
    precio: [0, [Validators.required, Validators.min(0)]],
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
          hora: this.extraerHora(act.fecha),
          deporte: this.deportes.find(d => d.name === act.deporte) ?? null,
          nivel: this.niveles.find(n => n.name.toUpperCase() === act.nivel.toUpperCase()) ?? null,
          ubicacion: act.ubicacion,
          estado: act.estado,
          numPersTotales: act.numPersTotales,
          precio: act.precio,
        });
        console.log(act);

        this.cargando = false;
      },
      error: (codigo) => {
        this.cargando = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: `No se pudo cargar la actividad (${codigo})` });
      }
    });
  }

  ngOnInit(): void {
    this.actividadId = Number(this.route.snapshot.paramMap.get('id'));
    if (!this.actividadId || Number.isNaN(this.actividadId)) {
      this.messageService.add({ severity: 'warn', summary: 'ID inválido', detail: 'No se pudo leer el ID de la actividad.' });
      return;
    }

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
      { name: 'Senderismo' }
    ];
    this.niveles = [
      { name: 'Iniciado' },
      { name: 'Principiante' },
      { name: 'Intermedio' },
      { name: 'Avanzado' },
      { name: 'Experto' }
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
      this.messageService.add({ severity: 'warn', summary: 'Formulario incompleto', detail: 'Revisa los campos obligatorios.' });
      return;
    }

    this.guardando = true;

    // Prepara el payload acorde al backend (strings/números/enum names)
    const payload = {
      ...this.actividadForm.value,
      // si tu backend espera nivel/estado como enums name, ya les estás enviando strings compatibles
      // si espera fecha ISO completa, convierte desde 'datetime-local' de nuevo:
    };

    this.actService.editarActividad(this.actividadId, payload).subscribe({
      next: (ok) => {
        this.guardando = false;
        if (ok === true) {
          this.messageService.add({ severity: 'success', summary: 'Guardado', detail: 'Actividad actualizada correctamente.' });
        } else {
          // si tu servicio devuelve códigos en next (por el map(() => true) / of(codigo))
          this.messageService.add({ severity: 'error', summary: 'Error', detail: String(ok) });
        }
      },
      error: (codigo) => {
        this.guardando = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: `No se pudo guardar (${codigo})` });
      }
    });
  }

  isInvalid(controlName: string): boolean {
    const control = this.actividadForm.get(controlName);
    return !!(control && control.invalid && control.touched);
  }
}
