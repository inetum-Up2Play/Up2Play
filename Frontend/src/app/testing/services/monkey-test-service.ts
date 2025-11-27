import { Injectable } from '@angular/core';
import * as gremlins from 'gremlins.js';

@Injectable({
  providedIn: 'root'
})
export class MonkeyTest {

  private horde: any;

  start(duration: number, containerSelector?: string) {
    const target = containerSelector
      ? document.querySelector(containerSelector) as HTMLElement
      : document.body;

    this.horde = gremlins.createHorde({
      species: [
        gremlins.species.clicker({ canClick: (elem: Node | null) => target.contains(elem) }),
        gremlins.species.scroller(),
        gremlins.species.formFiller()
      ],
      strategies: [gremlins.strategies.distribution()]
    });

    this.horde.unleash();
    console.log('Monkey testing iniciado...');
    setTimeout(() => this.stop(), duration);
  }

  stop() {
    if (this.horde) {
      this.horde.stop();
      console.log('Monkey testing detenido.');
    }
  }

}
