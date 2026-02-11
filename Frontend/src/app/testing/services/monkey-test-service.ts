import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MonkeyTest {
  private horde: any;

  // Hacemos la función asíncrona para poder importar gremlins bajo demanda
  async start(duration: number, containerSelector?: string) {
    
    // Verificamos el flag del environment
    if (!environment.enableMonkeyTesting) {
      console.warn('Monkey testing está deshabilitado en este entorno.');
      return;
    }

    // CARGA DINÁMICA: Importamos la librería solo en este momento
    const gremlins = await import('gremlins.js');

    const target = containerSelector
      ? document.querySelector(containerSelector) as HTMLElement
      : document.body;

    this.horde = gremlins.createHorde({
      species: [
        gremlins.species.clicker({ 
          canClick: (elem: Node | null) => target.contains(elem) 
        }),
        gremlins.species.scroller(),
        gremlins.species.formFiller()
      ],
      strategies: [gremlins.strategies.distribution()]
    });

    this.horde.unleash();
    console.log('🐒 Monkey testing iniciado dinámicamente...');
    
    setTimeout(() => this.stop(), duration);
  }

  stop() {
    if (this.horde && typeof this.horde.stop === 'function') {
      this.horde.stop();
      console.log('🐒 Monkey testing detenido.');
    }
  }
}