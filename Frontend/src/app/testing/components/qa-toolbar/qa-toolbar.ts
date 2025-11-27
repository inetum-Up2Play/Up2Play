import { Component } from '@angular/core';
import { MonkeyTest } from '../../services/monkey-test-service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-qa-toolbar',
  imports: [],
  templateUrl: './qa-toolbar.html',
  styleUrl: './qa-toolbar.scss'
})
export class QaToolbar {
  environment = environment;
  constructor(private monkeyService: MonkeyTest) {}

  start() {
  this.monkeyService.start(20000); // 20 segundos
  }

  stop() { this.monkeyService.stop(); }

}
