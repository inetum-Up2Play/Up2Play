import { Component, computed, signal, inject, untracked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { catchError, finalize, forkJoin, map, of, switchMap, tap } from 'rxjs';

import { DatePickerModule } from 'primeng/datepicker';

import { Header } from '../../../../core/layout/header/header';
import { Footer } from '../../../../core/layout/footer/footer';
import { IconDeportePipe } from '../../../../shared/pipes/icon-deporte-pipe';
import { PagosService, PagoDtoResp, ActividadCreadaDto } from '../../../../core/services/pagos/pagos-service';
import { Actividad } from '../../../../shared/models/Actividad';
import { ActService } from '../../../../core/services/actividad/act-service';


interface Pago {
  fecha: string;
  hora: string;
  actividadTitulo: string;
  actividadLugar: string;
  estado: 'COMPLETADO' | 'FALLIDO' | 'REEMBOLSADO';
  importe: number;
  deporte: string;
}

@Component({
  selector: 'app-historial-pagos',
  imports: [Header, Footer, CommonModule, IconDeportePipe, DatePickerModule, FormsModule],
  templateUrl: './historial-pagos.html',
  styleUrl: './historial-pagos.scss',
})

export class HistorialPagos {

  private pagosService = inject(PagosService);
  private actService = inject(ActService);

  // Estado de datos/UX
  actividades = signal<ActividadCreadaDto[]>([]);
  pagos = signal<Pago[]>([]);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  private actividadCache = new Map<number, Actividad>();

  // ====== Filtros ======
  search = signal<string>('');
  dateFrom = signal<Date | null>(null);
  dateTo = signal<Date | null>(null);
  amountMin = signal<string>('');
  amountMax = signal<string>('');

  // ====== Carga del servicio ======
  ngOnInit(): void {
    this.loadPagosUsuarioActual();
    this.loadCreadas();
    this.filteredPagos(); 
    untracked(() => this.currentPage.set(1));
  }

  loadCreadas() {
    this.loading.set(true);
    this.error.set(null);

    this.actService.listarActividadesCreadas()
      .pipe(
        tap(raw => {
          if (Array.isArray(raw)) {
            console.table(raw.map(a => ({
              id: a.id,
              nombre: a.nombre,
              fecha: a.fecha,
              inscritos: a.numPersInscritas,
              precio: a.precio
            })));
          }
        }),
        finalize(() => this.loading.set(false))
      )
      .subscribe({
        next: data => this.actividades.set(data ?? []),
        error: err => {
          console.error('[Actividades creadas] Error', err);
          this.error.set('No se pudieron cargar tus actividades creadas.');
          this.actividades.set([]);
        }
      });
  }

  /** Helpers de fecha */
  private startOfThisMonth(): Date {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
  }
  private endOfThisMonth(): Date {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
  }
  private parseFecha(f?: string): Date | null {
    if (!f) return null;
    const d = new Date(f);
    return isNaN(d.getTime()) ? null : d;
  }

  /** Devuelve el nº de inscritos que pagan (inscritos totales - 1 creador), sin bajar de 0 */
  private inscritosDePago(a: ActividadCreadaDto): number {
    const inscritos = Number(a.numPersInscritas) || 0;
    return Math.max(inscritos - 1, 0);
  }

  /** Actividades del mes actual (local) */
  actividadesMesActual = computed(() => {
    const from = this.startOfThisMonth();
    const to = this.endOfThisMonth();
    return this.actividades().filter(a => {
      const d = this.parseFecha(a.fecha);
      return d && d >= from && d <= to;
    });
  });

  /** Conteo de actividades del mes actual */
  totalActividadesMes = computed(() => this.actividadesMesActual().length);

  /** Ingresos del mes actual = sum(precio * inscritos) */
  ingresosMesActual = computed(() => {
    return this.actividadesMesActual().reduce((acc, a) => {
      const precio = Number(a.precio) || 0;
      const pagadores = this.inscritosDePago(a);
      return acc + (precio * pagadores);
    }, 0);
  });

  // Última actividad creada
  ultimaActividad = computed(() => {
    const list = this.actividades();
    if (!list || list.length === 0) return null;

    let latest: ActividadCreadaDto | null = null;
    let latestTime = -Infinity;

    for (const a of list) {
      const d = this.parseFecha?.(a.fecha) ?? (a.fecha ? new Date(a.fecha) : null);
      if (!d || isNaN(d.getTime())) continue;
      const t = d.getTime();
      if (t > latestTime) {
        latest = a;
        latestTime = t;
      }
    }
    return latest;
  });

  // Propiedades listas para template
  tituloUltimaActividad = computed(() => this.ultimaActividad()?.nombre ?? '');
  precioUltimaActividad = computed(() => Number(this.ultimaActividad()?.precio ?? 0));

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
              return of({ id, actividad: null as unknown as Actividad });
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

  onDateFromChange(value: Date | null) {
    this.dateFrom.set(value);
  }

  onDateToChange(value: Date | null) {
    this.dateTo.set(value);
  }

  onSearchInput(value: string) { this.search.set(value); }
  onAmountMinInput(value: string) { this.amountMin.set(value); }
  onAmountMaxInput(value: string) { this.amountMax.set(value); }

  // ====== Filtrado combinado ======
  filteredPagos = computed(() => {
    const term = this.normalize(this.search());

    const from = this.dateFrom();
    const toRaw = this.dateTo();
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
    if (total === 0) return { from: 0, to: 0, total: 0 };

    const from = (this.currentPage() - 1) * this.pageSize + 1;
    const to = Math.min(this.currentPage() * this.pageSize, total);

    return { from, to, total };
  }

  // ---- Variables de paginación ----
  currentPage = signal<number>(1);
  pageSize = 5;
  paginatedPagos = computed(() => {
    const startIndex = (this.currentPage() - 1) * this.pageSize;
    return this.filteredPagos().slice(startIndex, startIndex + this.pageSize);
  });
  totalPages = computed(() => Math.ceil(this.filteredPagos().length / this.pageSize));

  // ---- Navegación de páginas ----
  nextPage() {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update(p => p + 1);
    }
  }

  prevPage() {
    if (this.currentPage() > 1) {
      this.currentPage.update(p => p - 1);
    }
  }

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

  // ---------- Mapper DTO + Actividad -> Pago ----------
  private toPago(dto: PagoDtoResp, act?: Actividad): Pago {
    const d = dto.fecha ? new Date(dto.fecha) : null;
    const ok = d && !isNaN(d.getTime()) ? d : null;

    const actividadTitulo = dto.nombreActividad ?? '';

    const actividadLugar = act?.ubicacion ?? '';
    const deporte = act?.deporte ?? '';

    return {
      fecha: ok ? this.formatFechaEs(ok) : '',
      hora: ok ? this.formatHora(ok) : '',
      actividadTitulo,
      actividadLugar,
      estado: (dto.estado as Pago['estado']) ?? 'Completado',
      importe: Number(dto.total ?? 0),
      deporte
    };
  }
}



