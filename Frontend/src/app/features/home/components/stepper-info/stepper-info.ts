import { Component } from '@angular/core';

import { StepperModule } from 'primeng/stepper';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-stepper-info',
  imports: [StepperModule, ButtonModule],
  templateUrl: './stepper-info.html',
  styleUrl: './stepper-info.scss',
})
export class StepperInfo {

}
