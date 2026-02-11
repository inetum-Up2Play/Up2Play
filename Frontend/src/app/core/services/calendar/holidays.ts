import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { EventInput } from '@fullcalendar/core';

//INTERFACES
export interface NagerHoliday {
  date: string;            // "2025-01-01"
  localName: string;       // "Año Nuevo"
  name: string;            // "New Year's Day"
  countryCode: string;     // "ES"
  fixed: boolean;
  global: boolean;         // true si aplica a todo el país
  counties?: string[] | null; // p.ej. ["ES-CT"] si es autonómico
  launchYear?: number | null;
  types: string[];         // ["Public", "Bank", ...]
}

export interface HolidayOptions {
  includeNational: boolean;        // festivos nacionales (global=true)
  includeCatalonia: boolean;       // autonómicos Cataluña (counties incluye "ES-CT")
}

@Injectable({ providedIn: 'root' })
export class HolidaysService {
  private readonly baseUrl = 'https://date.nager.at/api/v3';

  constructor(private http: HttpClient) {}

  // Devuelve los festivos nacionales
  getSpainHolidays(year: number, opts: HolidayOptions): Observable<EventInput[]> {
    const url = `${this.baseUrl}/PublicHolidays/${year}/ES`;

    return this.http.get<NagerHoliday[]>(url).pipe(
      map((holidays) => {
        // Filtrado nacional/autonómico Cataluña
        const filtered = holidays.filter(h => {
          const isNational = h.global === true;
          const isCatalonia = Array.isArray(h.counties) && h.counties.includes('ES-CT');
          return (opts.includeNational && isNational) || (opts.includeCatalonia && isCatalonia);
        });

        // Mapeo a EventInput de FullCalendar (all-day, con clases)
        return filtered.map(h => {
          const title = h.localName || h.name;
          const isCatalonia = Array.isArray(h.counties) && h.counties.includes('ES-CT');

          return <EventInput>{
            id: `nager-${h.date}-${title}`,
            title,
            start: h.date,      // Formato ISO YYYY-MM-DD
            allDay: true,
            className: isCatalonia ? ['festivo', 'festivo-cat'] : ['festivo'],
            extendedProps: {
              nager: h,         
            },
          };
        });
      })
    );
  }
}
