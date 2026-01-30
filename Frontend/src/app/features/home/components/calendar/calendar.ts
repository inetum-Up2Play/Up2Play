
import { Component, inject } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { ActService } from '../../../../core/services/actividad/act-service';
import { map, tap, BehaviorSubject, switchMap, combineLatest, forkJoin } from 'rxjs';
import { Actividad } from '../../../../shared/models/Actividad';
import { Router } from '@angular/router';
import { HolidaysService } from '../../../../core/services/holidays';
import { of } from 'rxjs';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, FullCalendarModule, AsyncPipe],
  templateUrl: './calendar.html',
  styleUrls: ['./calendar.scss'],
})
export class Calendar {
  private actService = inject(ActService);
  private router = inject(Router);
  private holidaysService = inject(HolidaysService);

  private year$ = new BehaviorSubject<number>(new Date().getFullYear());

  private readonly OWNER_BG = '#3f9c44';
  private readonly OWNER_BORDER = '#b1df75be';
  private readonly OWNER_TEXT = '#ffffffff';
  private readonly OTHER_BG = '#b1df75be';
  private readonly OTHER_BORDER = '#3f9c44';
  private readonly OTHER_TEXT = '#152614';

  private events$ = this.actService.listarActividadesApuntadas().pipe(
    switchMap((acts: Actividad[]) => {
      if (!acts?.length) return of([] as EventInput[]);
      return forkJoin(
        acts.map(act =>
          this.actService.comprobarCreador(act.id).pipe(
            map(isOwner =>
              actividadToEventConColor(act, isOwner, {
                ownerBg: this.OWNER_BG,
                ownerBorder: this.OWNER_BORDER,
                ownerText: this.OWNER_TEXT,
                otherBg: this.OTHER_BG,
                otherBorder: this.OTHER_BORDER,
                otherText: this.OTHER_TEXT,
              })
            )
          )
        )
      );
    }),
    tap(events => console.log('[events$]', events))
  );

  private holidays$ = this.year$.pipe(
    switchMap(year =>
      this.holidaysService.getSpainHolidays(year, {
        includeNational: true,
        includeCatalonia: true,
      })
    ),
    tap(events => console.log(`[holidays$]`, events.length))
  );

  // Fusión de ambos
  mergedEvents$ = combineLatest([this.events$, this.holidays$]).pipe(
    map(([acts, hols]) => [...acts, ...hols]),
    tap(all => console.log('[mergedEvents$]', all.length))
  );

  // Opciones del calendario
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin],
    headerToolbar: { left: 'title', right: 'prev,next today' },
    buttonText: { today: 'Hoy' },
    locale: 'es',
    displayEventTime: false,
    firstDay: 1,
    dayHeaderFormat: { weekday: 'narrow' },

    height: '687px', // Ocupa el 100% del contenedor
    

    loading: (isLoading) => console.log('Loading events?', isLoading),

    datesSet: (arg) => {
      const visible = arg.view.currentStart;
      const year = visible.getFullYear();
      this.year$.next(year);
    },

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
}

function normalizeToDay(fecha: string): string {
  return fecha.includes('T') ? fecha.split('T')[0] : fecha;
}

function actividadToEventConColor(
  act: Actividad,
  isOwner: boolean,
  colors: {
    ownerBg: string; ownerBorder: string; ownerText: string;
    otherBg: string; otherBorder: string; otherText: string;
  }
): EventInput {
  const startDay = normalizeToDay(act.fecha);
  return {
    id: String(act.id),
    title: act.nombre,
    start: startDay,
    allDay: true,
    extendedProps: { actividad: act, isOwner },
    backgroundColor: isOwner ? colors.ownerBg : colors.otherBg,
    borderColor: isOwner ? colors.ownerBorder : colors.otherBorder,
    textColor: isOwner ? colors.ownerText : colors.otherText,
    classNames: isOwner ? ['event-owner'] : ['event-other'],
  };
}
