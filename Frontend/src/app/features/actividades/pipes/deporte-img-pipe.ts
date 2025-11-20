import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'deporteImg'
})
export class DeporteImgPipe implements PipeTransform {


  transform(deporte: string): string {
    const cdnBase = 'https://cdn.tu-servidor.com/deportes/';
    const map: Record<string, string> = {
      'Arquería': 'arqueria.jpg',
      'Atletismo': 'atletismo.jpg',
      'Balonmano': 'balonmano.jpg',
      'Basquet': 'basquet.jpg',
      'Béisbol': 'beisbol.jpg',
      'Billar': 'billar.jpg',
      'Boxeo': 'boxeo.jpg',
      'Críquet': 'criquet.jpg',
      'Ciclismo': 'ciclismo.jpg',
      'Escalada': 'escalada.jpg',
      'Esgrima': 'esgrima.jpg',
      'Esquí': 'esqui.jpg',
      'Futbol': 'futbol.jpg',
      'Gimnasia': 'gimnasia.jpg',
      'Golf': 'golf.jpg',
      'Hockey': 'hockey.jpg',
      'ArtesMarciales': 'artesMarciales.jpg',
      'Natación': 'natacion.jpg',
      'Patinaje': 'patinaje.jpg',
      'Ping Pong': 'pingpong.jpg',
      'Piragüismo': 'piragüismo.jpg',
      'Rugby': 'rugby.jpg',
      'Remo': 'remo.jpg',
      'Snowboard': 'snowboard.jpg',
      'Surf': 'surf.jpg',
      'Tenis': 'tenis.jpg',
      'Triatlón': 'triatlon.jpg',
      'Voleibol': 'voleibol.jpg',
      'Waterpolo': 'waterpolo.jpg',
      'Ajedrez': 'ajedrez.jpg',
      'Badminton': 'badminton.jpg',
      'Crossfit': 'crossfit.jpg',
      'Danza Deportiva': 'danza-deportiva.jpg',
      'Entrenamiento de fuerza': 'entrenamiento-fuerza.jpg',
      'Equitación': 'equitacion.jpg',
      'Fútbol Americano': 'futbol-americano.jpg',
      'Lucha Libre': 'lucha-libre.jpg',
      'Motocross': 'motocross.jpg',
      'Padel': 'padel.jpg',
      'Parkour': 'parkour.jpg',
      'Raquetbol': 'raquetbol.jpg',
      'Skateboarding': 'skateboarding.jpg',
      'Squash': 'squash.jpg',
      'Tiro con Arco': 'tiro-con-arco.jpg',
      'Ultimate Frisbee': 'ultimate-frisbee.jpg'
    };

    return cdnBase + (map[deporte] || 'default.jpg');
  }

}
