import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PrimeNG } from 'primeng/config';

// PrimeNG
import { Toast } from 'primeng/toast';
import { PRIMENG_ES } from './core/i18n/primeng-es';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Toast],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})

export class App implements OnInit{
  protected readonly title = signal('Frontend');

  private primengConfig = inject(PrimeNG)

  ngOnInit(): void {
    this.primengConfig.setTranslation(PRIMENG_ES)
  }
}
