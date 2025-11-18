import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'deporteImg'
})
export class DeporteImgPipe implements PipeTransform {

  transform(deporte: string): string {
    const cdnBase = 'https://cdn.tu-servidor.com/deportes/';
    const map: Record<string, string> = {
      'Running': 'running.jpg',
      'Fútbol': 'futbol.jpg',
      'Baloncesto': 'baloncesto.jpg',
      'Tenis': 'tenis.jpg',
      'Natación': 'natacion.jpg',
      // ... añade las 20 opciones
    };
    return cdnBase + (map[deporte] || 'default.jpg');
  }

}
