import { Component, inject } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { ActService } from '../../../../core/services/actividad/act-service';
import { map, tap } from 'rxjs';
import { Actividad } from '../../../../shared/models/Actividad';
import { Router } from '@angular/router';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, FullCalendarModule, AsyncPipe],
  templateUrl: './calendar.html',
  styleUrl: './calendar.scss',
})
export class Calendar {
  private actService = inject(ActService);
  private router = inject(Router);

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin],
    headerToolbar: { left: 'title', right: 'prev,next today' },
    buttonText: { today: 'Hoy' },
    locale: 'es',
    displayEventTime: false,
    firstDay: 1, // semana empieza en lunes
    dayHeaderFormat: { weekday: 'narrow' },

    eventDidMount: (arg) => {
      arg.el.title = arg.event.title;
      (arg.el as HTMLElement).style.cursor = 'pointer';
    },
    eventClick: (arg) => {
      arg.jsEvent?.preventDefault();
      arg.jsEvent?.stopPropagation();

      const act: Actividad | undefined = arg.event.extendedProps?.['actividad'];
      const id = act?.id ?? Number(arg.event.id);
      if (!id) return;

      this.router.navigate(['/actividades/info-actividad', id]);
    },
  };

  // Cargamos actividades y las mapeamos a eventos de un día
  events$ = this.actService.listarActividadesApuntadas().pipe(
    map((acts: Actividad[]) => acts.map(actividadToEvent)),
    tap((events) => console.log('[events$]', events))
  );

  handleDateClick(arg: any) {
    alert('date click! ' + arg.dateStr);
  }
}

// ---- helpers (puedes moverlos a un archivo util.ts si prefieres)
function normalizeToDay(fecha: string): string {
  return fecha.includes('T') ? fecha.split('T')[0] : fecha;
}

function actividadToEvent(act: Actividad): EventInput {
  const startDay = normalizeToDay(act.fecha);
  return {
    id: String(act.id),
    title: act.nombre,
    start: startDay,
    allDay: true,
    extendedProps: { actividad: act },
  };
}
