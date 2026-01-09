import { Component, computed, signal } from '@angular/core';
import { Header } from '../../../../core/layout/header/header';
import { Footer } from '../../../../core/layout/footer/footer';
import { CommonModule } from '@angular/common';
import { IconDeportePipe } from '../../../../shared/pipes/icon-deporte-pipe';

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
  imports: [Header, Footer, CommonModule, IconDeportePipe],
  templateUrl: './historial-pagos.html',
  styleUrl: './historial-pagos.scss',
})
export class HistorialPagos {

  // Demo: reemplaza por tu data real (servicio, etc.)
  pagos = signal<Pago[]>([
    {
      fecha: '14 Oct 2026',
      hora: '10:30',
      actividadTitulo: 'Tenis de tranquis',
      actividadLugar: 'Tennis nástic',
      estado: 'Fallido',
      importe: 10.00,
      deporte: 'tenis'
    },
    {
      fecha: '14 Oct 2023',
      hora: '18:30',
      actividadTitulo: 'Fútbol 7 - Torneo',
      actividadLugar: 'Polideportivo Central',
      estado: 'Completado',
      importe: 15.00,
      deporte: 'futbol'
    },
    {
      fecha: '17 Dic 2025',
      hora: '18:30',
      actividadTitulo: 'Tiroteo remix',
      actividadLugar: 'Campoclaro',
      estado: 'Completado',
      importe: 25.00,
      deporte: 'tiro-con-arco'
    },
    {
      fecha: '2 Ene 2025',
      hora: '20:30',
      actividadTitulo: 'Excursion por la montaña',
      actividadLugar: 'La Mussara',
      estado: 'Fallido',
      importe: 5.00,
      deporte: 'senderismo'
    },
    {
      fecha: '8 Feb 2025',
      hora: '8:30',
      actividadTitulo: 'Gym con las mamis',
      actividadLugar: 'Viding Tarragona',
      estado: 'Completado',
      importe: 50.00,
      deporte: 'crossfit'
    },
    // ...
  ]);

  // ====== Signals de filtro ======
  search = signal<string>('');
  dateFrom = signal<string>('');   // formato input type="date": 'YYYY-MM-DD'
  dateTo = signal<string>('');   // formato input type="date"
  amountMin = signal<string>('');  // números en string para inputs
  amountMax = signal<string>('');

  // ====== Helpers ======
  private normalize(text: string): string {
    return (text ?? '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  }

  /** Mapa meses ES: soporta abreviaturas y nombres completos */
  private readonly monthMap: Record<string, number> = {
    ene: 0, enero: 0,
    feb: 1, febrero: 1,
    mar: 2, marzo: 2,
    abr: 3, abril: 3,
    may: 4, mayo: 4,
    jun: 5, junio: 5,
    jul: 6, julio: 6,
    ago: 7, agosto: 7,
    sep: 8, set: 8, septiembre: 8,
    oct: 9, octubre: 9,
    nov: 10, noviembre: 10,
    dic: 11, diciembre: 11,
  };

  /** Convierte '14 Oct 2026' -> Date | null (zona local) */
  private parseFechaToDate(fecha: string): Date | null {
    if (!fecha) return null;
    const parts = fecha.trim().split(/\s+/); // ['14','Oct','2026']
    if (parts.length < 3) return null;
    const day = Number(parts[0]);
    const monthKey = this.normalize(parts[1]).slice(0, 3); // 'oct', 'dic', 'ene'...
    const year = Number(parts[2]);
    const monthIndex = this.monthMap[monthKey];
    if (Number.isNaN(day) || Number.isNaN(year) || monthIndex === undefined) return null;
    const d = new Date(year, monthIndex, day);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  private parseInputDate(value: string): Date | undefined {
    if (!value) return undefined; // input vacío -> no filtro
    const d = new Date(value);
    if (isNaN(d.getTime())) return undefined;
    d.setHours(0, 0, 0, 0);
    return d;
  }

  private parseAmount(value: string): number | undefined {
    if (!value) return undefined;
    const n = Number(String(value).replace(',', '.'));
    return Number.isFinite(n) ? n : undefined;
  }

  /** Establece el rango a "este mes" (desde el día 1 al último del mes actual) */
  setThisMonth() {
    const now = new Date();
    const y = now.getFullYear();
    const m = now.getMonth();
    const first = new Date(y, m, 1);
    const last = new Date(y, m + 1, 0);
    const toStr = (d: Date) =>
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    this.dateFrom.set(toStr(first));
    this.dateTo.set(toStr(last));
  }

  // ====== Handlers de inputs ======
  onSearchInput(value: string) { this.search.set(value); }
  onDateFromInput(value: string) { this.dateFrom.set(value); }
  onDateToInput(value: string) { this.dateTo.set(value); }
  onAmountMinInput(value: string) { this.amountMin.set(value); }
  onAmountMaxInput(value: string) { this.amountMax.set(value); }

  onDateFocus(el: HTMLInputElement) {
    // Abre el picker si el navegador lo soporta
    (el as any).showPicker?.();
  }

  onDateClick(el: HTMLInputElement) {
    (el as any).showPicker?.();
  }

  // ====== Filtrado combinado ======
  filteredPagos = computed(() => {
    const term = this.normalize(this.search());

    // Parsear filtros
    const from = this.parseInputDate(this.dateFrom());
    const to = this.parseInputDate(this.dateTo());
    const min = this.parseAmount(this.amountMin());
    const max = this.parseAmount(this.amountMax());

    return this.pagos().filter(p => {
      // 1) Título actividad
      const matchesTitle = term
        ? this.normalize(p.actividadTitulo).includes(term)
        : true;

      // 2) Fecha
      const d = this.parseFechaToDate(p.fecha);
      const matchesDate =
        (!from && !to) ? true :
          (d
            && (!from || d.getTime() >= from.getTime())
            && (!to || d.getTime() <= to.getTime()));

      // 3) Importe
      const amt = p.importe;
      const matchesAmount =
        (min === undefined || amt >= min) &&
        (max === undefined || amt <= max);

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



