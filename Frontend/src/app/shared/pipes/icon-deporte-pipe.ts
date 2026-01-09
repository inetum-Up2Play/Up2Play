import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'iconDeporte'
})
export class IconDeportePipe implements PipeTransform {


  // Fallback genérico si no hay icono específico
  private static readonly DEFAULT_ICON = 'ph ph-shapes';

  // Normalizador: quita acentos, pasa a minúsculas y cambia espacios por guiones
  private slugify(input: string): string {
    return (input ?? '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');
  }

  // Mapa deporte (slug) -> clase de icono (Phosphor)
  // Ajusta libremente las clases a tu set real.
  private static readonly ICON_DEPORTES: Record<string, string> = {
    atletismo: 'ph ph-person-simple-run',
    balonmano: 'ph ph-meteor',          
    basquet: 'ph ph-basketball',
    beisbol: 'ph ph-baseball',             
    billar: 'ph ph-circle',
    boxeo: 'ph ph-hand-fist',
    criquet: 'ph ph-target',
    ciclismo: 'ph ph-bicycle',
    escalada: 'ph ph-mountains',
    esgrima: 'ph ph-sword',
    esqui: 'ph ph-snowflake',
    futbol: 'ph ph-soccer-ball',
    gimnasia: 'ph ph-person-simple',
    golf: 'ph ph-flag',
    hockey: 'ph ph-hockey',           
    'artes-marciales': 'ph ph-user',
    natacion: 'ph ph-wave-sine',
    patinaje: 'ph ph-person-simple-snowboard',          
    'ping-pong': 'ph ph-ping-pong',           
    piraguismo: 'ph ph-boat',
    rugby: 'ph ph-football',
    remo: 'ph ph-boat',
    snowboard: 'ph ph-snowflake',
    surf: 'ph ph-wave-sine',
    tenis: 'ph ph-tennis-ball',
    triatlon: 'ph ph-activity',
    voleibol: 'ph ph-volleyball',
    waterpolo: 'ph ph-water',
    ajedrez: 'ph ph-chess-knight',
    badminton: 'ph ph-circle',
    crossfit: 'ph ph-barbell',
    'danza-deportiva': 'ph ph-music-notes',
    'entrenamiento-de-fuerza': 'ph ph-dumbbell',
    equitacion: 'ph ph-horse',           
    'futbol-americano': 'ph ph-football',
    'lucha-libre': 'ph ph-users-three',
    motocross: 'ph ph-motorcycle',
    padel: 'ph ph-tennis-ball',
    parkour: 'ph ph-person-simple-run',
    skateboarding: 'ph ph-skateboard',
    squash: 'ph ph-tennis-ball',
    'tiro-con-arco': 'ph ph-crosshair',
    frisbee: 'ph ph-disc',
    senderismo: 'ph ph-backpack',
    running: 'ph ph-person-simple-run',
    petanca: 'ph ph-circle'
  };

  /**
   * Devuelve la clase del icono para el deporte indicado.
   * @param deporte Nombre o slug del deporte (con o sin acentos).
   * @returns Clase CSS del icono (si no hay match, devuelve un fallback).
   */

  transform(deporte: string | null | undefined): string {
    if (!deporte) return IconDeportePipe.DEFAULT_ICON;
    const slug = this.slugify(deporte);
    return IconDeportePipe.ICON_DEPORTES[slug] ?? IconDeportePipe.DEFAULT_ICON;
  }
}

