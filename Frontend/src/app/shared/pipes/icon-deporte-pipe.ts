import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'iconDeporte'
})
export class IconDeportePipe implements PipeTransform {

  // Fallback genérico si no hay icono específico
  private static readonly DEFAULT_ICON = 'ph ph-list-magnifying-glass';

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
  private static readonly ICON_DEPORTES: Record<string, string> = {
    atletismo: 'ph ph-person-simple-run',
    balonmano: 'ph ph-meteor',          
    basquet: 'ph ph-basketball',
    beisbol: 'ph ph-baseball',             
    billar: 'ph ph-number-circle-eight',
    boxeo: 'ph ph-boxing-glove',
    criquet: 'ph ph-cricket',
    ciclismo: 'ph ph-bicycle',
    escalada: 'ph ph-mountains',
    esgrima: 'ph ph-sword',
    esqui: 'ph ph-person-simple-ski',
    futbol: 'ph ph-soccer-ball',
    gimnasia: 'ph ph-person-simple',
    golf: 'ph ph-golf',
    hockey: 'ph ph-hockey',           
    'artes-marciales': 'ph ph-person-simple-tai-chi',
    natacion: 'ph ph-person-simple-swim',
    patinaje: 'ph ph-boot',
    'ping-pong': 'ph ph-ping-pong',           
    piraguismo: 'ph ph-boat',
    rugby: 'ph ph-football',
    remo: 'ph ph-waves',
    snowboard: 'ph ph-person-simple-snowboard',
    surf: 'ph ph-wave-sine',
    tenis: 'ph ph-tennis-ball',
    triatlon: 'ph ph-activity',
    voleibol: 'ph ph-volleyball',
    waterpolo: 'ph ph-swimming-pool',
    ajedrez: 'ph ph-crown-cross',
    badminton: 'ph ph-feather',
    crossfit: 'ph ph-barbell',
    'danza-deportiva': 'ph ph-music-notes',
    'entrenamiento-de-fuerza': 'ph ph-barbell',
    equitacion: 'ph ph-horse',           
    'futbol-americano': 'ph ph-football',
    'lucha-libre': 'ph ph-users-three',
    motocross: 'ph ph-motorcycle',
    padel: 'ph ph-tennis-ball',
    parkour: 'ph ph-person-simple-run',
    skateboarding: 'ph ph-person-simple-snowboard',
    squash: 'ph ph-racquet',
    'tiro-con-arco': 'ph ph-crosshair',
    frisbee: 'ph ph-disc',
    senderismo: 'ph ph-backpack',
    running: 'ph ph-person-simple-run',
    petanca: 'ph ph-boules'
  };

  /* Devuelve el icono para el deporte indicado */

  transform(deporte: string | null | undefined): string {
    if (!deporte) return IconDeportePipe.DEFAULT_ICON;
    const slug = this.slugify(deporte);
    return IconDeportePipe.ICON_DEPORTES[slug] ?? IconDeportePipe.DEFAULT_ICON;
  }
}

