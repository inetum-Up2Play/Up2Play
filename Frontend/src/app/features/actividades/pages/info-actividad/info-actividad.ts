import { Component, input, signal } from '@angular/core';

import { CardModule } from 'primeng/card';
import { Actividad } from '../../../../core/models/Actividad';

@Component({
  selector: 'app-info-actividad',
  imports: [CardModule],
  templateUrl: './info-actividad.html',
  styleUrl: './info-actividad.scss'
})
export class InfoActividad {
  actividad = signal<Actividad | null>(null);

  // actividad = {
  //   id: 1,
  //   titulo: 'Running por la playa',
  //   descripcion: 'Este fin de semana vamos a correr por la Playa Larga. Es un plan sencillo para disfrutar del mar y el amanecer mientras hacemos algo de ejercicio. El recorrido será cómodo, apto para cualquiera que quiera moverse y pasar un buen rato. Solo necesitas ropa deportiva y agua. Al terminar, nos quedamos un rato para estirar y charlar. ¿Te animas? :)',
  //   fecha: '2025-11-20',
  //   hora: '08:00',
  //   ubicacion: 'Playa de Tokyo',
  //   nivel: 'Intermedio',
  //   num_pers_inscritas: '3',
  //   num_pers_totales: '10',
  //   estado: 'Pendiente',
  //   precio: '0',
  //   id_usuario_creador: '13',
  //   deporte: 'Running',
  // }

  // constructor(private actividadService: ActividadService) {
  //   // Simulación: obtener actividad por ID
  //   this.actividadService.getActividadById(1).subscribe(data => {
  //     this.actividad.set(data); // Actualizamos la signal con la respuesta
  //   });
  // }
}
