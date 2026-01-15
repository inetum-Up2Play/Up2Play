import { ViewportScroller } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { AccordionModule } from 'primeng/accordion'; 
import { Button } from 'primeng/button';

@Component({
  selector: 'app-politica-devoluciones',
  imports: [AccordionModule, Button],
  templateUrl: './politica-devoluciones.html',
  styleUrl: './politica-devoluciones.scss',
})
export class PoliticaDevoluciones {
private readonly viewportScroller = inject(ViewportScroller);

  lastUpdate = signal('Enero, 2026');
  activeAccordionValue = 'conditions';

  summaryCards = [
    {
      icon: 'autorenew',
      // Usamos las clases definidas en el SCSS
      bgClass: 'bg-light-green', 
      textClass: 'text-brand',
      title: 'Reembolso Condicionado',
      desc: '100% de reembolso si cancelas con más de 24h de antelación. 0% si es dentro de las últimas 24h.'
    },
    {
      icon: 'shield_lock',
      bgClass: 'bg-soft-brand',
      textClass: 'text-brand-dark dark:text-white', // dark:text-white es tailwind nativo
      title: 'Cancelación del Organizador',
      desc: 'Si el creador elimina la actividad, recibes el reembolso completo automáticamente.'
    },
    {
      icon: 'support_agent',
      bgClass: 'bg-soft-accent',
      textClass: 'text-brand',
      title: 'Soporte Personalizado',
      desc: 'Revisión manual de casos de fuerza mayor a través de nuestro correo de soporte.'
    }
  ];

  exceptions = [
    'Condiciones climáticas extremas.',
    'Emergencias médicas justificadas.',
    'Otras causas de fuerza mayor ajenas al control del usuario.'
  ];

  scrollTo(elementId: string): void {
    if (['conditions', 'deadlines', 'process', 'exceptions'].includes(elementId)) {
        this.activeAccordionValue = elementId;
    }
    setTimeout(() => {
        this.viewportScroller.setOffset([0, 100]); 
        this.viewportScroller.scrollToAnchor(elementId);
    }, 100);
  }
}
