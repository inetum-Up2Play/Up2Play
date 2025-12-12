import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'deporteImg',
  standalone: true 
})
export class DeporteImgPipe implements PipeTransform {


  transform(deporte: string): string {
    const cdnBase = 'https://up2play-mvp.github.io/CDN/deportes/';
    const map: Record<string, string> = {
      'Atletismo': 'atletismo.webp',
      'Balonmano': 'balonmano.webp',
      'Basquet': 'basquet.webp',
      'Béisbol': 'beisbol.webp',
      'Billar': 'billar.webp',
      'Boxeo': 'boxeo.webp',
      'Críquet': 'criquet.webp',
      'Ciclismo': 'ciclismo.webp',
      'Escalada': 'escalada.webp',
      'Esgrima': 'esgrima.webp',
      'Esquí': 'esqui.webp',
      'Futbol': 'futbol.webp',
      'Gimnasia': 'gimnasia.webp',
      'Golf': 'golf.webp',
      'Hockey': 'hockey.webp',
      'Artes Marciales': 'artesMarciales.webp',
      'Natación': 'natacion.webp',
      'Patinaje': 'patinaje.webp',
      'Ping Pong': 'pingpong.webp',
      'Piragüismo': 'piragüismo.webp',
      'Rugby': 'rugby.webp',
      'Remo': 'remo.webp',
      'Snowboard': 'snowboard.webp',
      'Surf': 'surf.webp',
      'Tenis': 'tenis.webp',
      'Triatlón': 'triatlon.webp',
      'Voleibol': 'voleibol.webp',
      'Waterpolo': 'waterpolo.webp',
      'Ajedrez': 'ajedrez.webp',
      'Badminton': 'badminton.webp',
      'Crossfit': 'crossfit.webp',
      'Danza Deportiva': 'danza-deportiva.webp',
      'Entrenamiento de fuerza': 'entrenamiento-fuerza.webp',
      'Equitación': 'equitacion.webp',
      'Fútbol Americano': 'futbol-americano.webp',
      'Lucha Libre': 'lucha-libre.webp',
      'Motocross': 'motocross.webp',
      'Padel': 'padel.webp',
      'Parkour': 'parkour.webp',
      'Skateboarding': 'skateboarding.webp',
      'Squash': 'squash.webp',
      'Tiro con Arco': 'tiro-con-arco.webp',
      'Frisbee': 'frisbee.webp',
      'Senderismo': 'senderismo.webp',
      'Running': 'running.webp',
      'Petanca': 'petanca.webp'
    };

    return cdnBase + (map[deporte] || 'default.webp');
  }

}
