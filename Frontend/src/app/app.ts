import { Component, computed, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

// PrimeNG
import { Toast } from 'primeng/toast';
import { SnowfallComponent } from './features/navidad/components/snowfall-component/snowfall-component';
import { Header } from './core/layout/header/header';
import { AuthHeaderComponent} from './features/auth/components/auth-header.component/auth-header.component';
import { SnowService } from './core/services/navidad/snow-service';
import { SantaComponent } from './features/navidad/components/santa-component/santa-component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Toast, SnowfallComponent, Header, AuthHeaderComponent, SantaComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})

export class App {
  protected readonly title = signal('Frontend');


  private snow = inject(SnowService);

  // Reactivo: se actualiza cuando cualquier header cambia  // Reactivo: se actualiza cuando cualquier header cambia el estado
  showSnow = computed(() => this.snow.isSnowing());




}
