import { environment } from '../environments/environment';
import { MonkeyTest } from './testing/services/monkey-test-service';
import { QaToolbar } from './testing/components/qa-toolbar/qa-toolbar';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { PrimeNG } from 'primeng/config';
import { filter } from 'rxjs';

// PrimeNG
import { Toast } from 'primeng/toast';
import { PRIMENG_ES } from './core/i18n/primeng-es';
import { Header } from './core/layout/header/header';
import { AuthHeaderComponent } from './features/auth/components/auth-header.component/auth-header.component';



@Component({
  selector: 'app-root',
  imports: [RouterOutlet, QaToolbar, Toast],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})

export class App implements OnInit {
  protected readonly title = signal('Frontend');
  environment = environment;


  private primengConfig = inject(PrimeNG)
  constructor(private router: Router) { }

  ngOnInit(): void {
    this.primengConfig.setTranslation(PRIMENG_ES)

    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' }); // o 'auto' scroll top al cambiar de páginas
      });
  }

}
