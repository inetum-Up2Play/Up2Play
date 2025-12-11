import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { environment } from '../environments/environment';
import { MonkeyTest } from './testing/services/monkey-test-service';
import { QaToolbar } from './testing/components/qa-toolbar/qa-toolbar';

// PrimeNG
import { Toast } from 'primeng/toast';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, QaToolbar, Toast],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})

export class App {
  protected readonly title = signal('Frontend');
  environment = environment;


}
