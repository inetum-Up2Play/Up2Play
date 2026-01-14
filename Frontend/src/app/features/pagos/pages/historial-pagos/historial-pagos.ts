import { Component, computed, signal, OnInit, inject } from '@angular/core';
import { Header } from '../../../../core/layout/header/header';
import { Footer } from '../../../../core/layout/footer/footer';
import { CommonModule } from '@angular/common';
import { IconDeportePipe } from '../../../../shared/pipes/icon-deporte-pipe';
import { DatePickerModule } from 'primeng/datepicker';
import { FormsModule } from '@angular/forms';
import { catchError, finalize, forkJoin, map, of, switchMap, tap } from 'rxjs';
import { PagosService, PagoDtoResp } from '../../../../core/services/pagos/pagos-service';
import { Actividad } from '../../../../shared/models/Actividad';
import { ActService } from '../../../../core/services/actividad/act-service';


interface Pago {
  fecha: string;            // '14 Oct 2023'
  hora: string;             // '18:30'
  actividadTitulo: string;  // 'Fútbol 7 - Torneo'
  actividadLugar: string;   // 'Polideportivo Central'
  estado: 'Completado' | 'Fallido';
  importe: number;          // ej. 15.00
  deporte: string; // Nuevo: deporte
}

@Component({
  selector: 'app-historial-pagos',
  imports: [Header, Footer, CommonModule, IconDeportePipe, DatePickerModule, FormsModule],
  templateUrl: './historial-pagos.html',
  styleUrl: './historial-pagos.scss',
})
export class HistorialPagos {

  private pagosService = inject(PagosService);

  private actService = inject(ActService); // <-- reemplaza por tu nombre de servicio real

  // Estado de datos/UX
  pagos = signal<Pago[]>([]);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  // ---------- Caché para no repetir llamadas por actividad ----------
  private actividadCache = new Map<number, Actividad>();

  // ====== Filtros ======
  search = signal<string>('');
  dateFrom = signal<Date | null>(null);
  dateTo = signal<Date | null>(null);
  amountMin = signal<string>('');
  amountMax = signal<string>('');

  // ====== Helpers ======
  private normalize(text: string): string {
    return (text ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
  }

  private readonly monthMap: Record<string, number> = {
    ene: 0, enero: 0, feb: 1, febrero: 1, mar: 2, marzo: 2, abr: 3, abril: 3,
    may: 4, mayo: 4, jun: 5, junio: 5, jul: 6, julio: 6, ago: 7, agosto: 7,
    sep: 8, set: 8, septiembre: 8, oct: 9, octubre: 9, nov: 10, noviembre: 10,
    dic: 11, diciembre: 11,
  };

  private parseFechaToDate(fecha: string): Date | null {
    if (!fecha) return null;
    const parts = fecha.trim().split(/\s+/); // ['14','Oct','2026']
    if (parts.length < 3) return null;
    const day = Number(parts[0]);
    const monthKey = this.normalize(parts[1]).slice(0, 3);
    const year = Number(parts[2]);
    const monthIndex = this.monthMap[monthKey];
    if (Number.isNaN(day) || Number.isNaN(year) || monthIndex === undefined) return null;
    const d = new Date(year, monthIndex, day);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  private parseAmount(value: string): number | undefined {
    if (!value) return undefined;
    const n = Number(String(value).replace(',', '.'));
    return Number.isFinite(n) ? n : undefined;
  }

  private formatFechaEs(d: Date): string {
    const fmt = d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
    return fmt.replace(/\b([a-záéíóúñü])/, (m) => m.toUpperCase());
  }
  private formatHora(d: Date): string {
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    return `${hh}:${mm}`;
  }

  /** Mapper: PagoDtoResp -> Pago (lo que usa tu tabla) */

  // ---------- Mapper DTO + Actividad -> Pago ----------
  private toPago(dto: PagoDtoResp, act?: Actividad): Pago {
    const d = dto.fecha ? new Date(dto.fecha) : null;
    const ok = d && !isNaN(d.getTime()) ? d : null;

    // OJO: nombreActividad es el campo que llega del back
    const actividadTitulo = dto.nombreActividad ?? '';

    // Usamos datos de la actividad si existen; si no, dejamos vacío
    const actividadLugar = act?.ubicacion ?? '';
    const deporte = act?.deporte ?? '';

    return {
      fecha: ok ? this.formatFechaEs(ok) : '',
      hora: ok ? this.formatHora(ok) : '',
      actividadTitulo,
      actividadLugar,
      estado: 'Completado',      // ajusta si incorporas estado real
      importe: Number(dto.total ?? 0),
      deporte
    };
  }


  // ====== Cargar del servicio ======
  ngOnInit(): void {
    this.loadPagosUsuarioActual();
  }

  loadPagosUsuarioActual() {
    this.loading.set(true);
    this.error.set(null);


    this.pagosService.getPagosUsuarioActual().pipe(
      tap(dtos => console.log('[GET /getPagos] body:', dtos)),
      switchMap((dtos: PagoDtoResp[]) => {
        const uniqueIds = Array.from(new Set(dtos.map(d => d.actividadId)));

        // Preparar Observables de actividades con caché
        const requests = uniqueIds.map(id => {
          const cached = this.actividadCache.get(id);
          if (cached) return of({ id, actividad: cached });

          return this.actService.getActividad(id).pipe(
            tap(act => { if (act) this.actividadCache.set(id, act); }),
            map(act => ({ id, actividad: act as Actividad })),
            catchError(err => {
              console.error(`[Actividad ${id}] error`, err);
              return of({ id, actividad: null as unknown as Actividad }); // guardamos null
            })
          );
        });

        // Si no hay actividades únicas, seguimos con map vacío
        const actividades$ = requests.length ? forkJoin(requests) : of([]);

        return actividades$.pipe(
          map(pares => {
            const actMap = new Map<number, Actividad>();
            (pares as { id: number; actividad: Actividad }[]).forEach(({ id, actividad }) => {
              if (actividad) actMap.set(id, actividad);
            });
            return { dtos, actMap };
          })
        );
      }),
      map(({ dtos, actMap }) => dtos.map(dto => this.toPago(dto, actMap.get(dto.actividadId)))),
      tap(pagos => console.table(pagos.map(p => ({
        titulo: p.actividadTitulo, lugar: p.actividadLugar, deporte: p.deporte, importe: p.importe
      })))),
      finalize(() => this.loading.set(false))
    ).subscribe({
      next: pagos => this.pagos.set(pagos),
      error: err => {
        console.error('[HistorialPagos] Error', err);
        this.error.set('No se pudo cargar el historial de pagos.');
        this.pagos.set([]);
      }
    });

  }


  setThisMonth() {
    const now = new Date();
    const from = new Date(now.getFullYear(), now.getMonth(), 1);
    const to = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    this.dateFrom.set(from);
    this.dateTo.set(to);
  }

  // Handlers (reciben Date | null)
  onDateFromChange(value: Date | null) {
    this.dateFrom.set(value);
  }

  onDateToChange(value: Date | null) {
    this.dateTo.set(value);
  }

  // Los de búsqueda e importes siguen igual (strings)
  onSearchInput(value: string) { this.search.set(value); }
  onAmountMinInput(value: string) { this.amountMin.set(value); }
  onAmountMaxInput(value: string) { this.amountMax.set(value); }

  // ====== Filtrado combinado ======

  filteredPagos = computed(() => {
    const term = this.normalize(this.search());

    const from = this.dateFrom();
    const toRaw = this.dateTo();
    // aseguramos inclusión del día final
    const to = toRaw ? new Date(toRaw.getFullYear(), toRaw.getMonth(), toRaw.getDate(), 23, 59, 59, 999) : null;

    return this.pagos().filter(p => {
      const matchesTitle = term ? this.normalize(p.actividadTitulo).includes(term) : true;

      const d = this.parseFechaToDate(p.fecha); // Date de la fila
      const matchesDate =
        (!from && !to) ? true :
          (d && (!from || d >= from) && (!to || d <= to));

      const min = this.parseAmount(this.amountMin());
      const max = this.parseAmount(this.amountMax());
      const matchesAmount = (min === undefined || p.importe >= min) &&
        (max === undefined || p.importe <= max);

      return matchesTitle && matchesDate && matchesAmount;
    });
  });

  // Para track en @for
  trackPago(_i: number, p: Pago) {
    return `${p.fecha}|${p.hora}|${p.actividadTitulo}`;
  }

  get showingRange() {
    const total = this.filteredPagos().length;
    const from = total ? 1 : 0;
    const to = Math.min(5, total);
    return { from, to, total };
  }
}



