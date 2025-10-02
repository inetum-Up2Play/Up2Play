import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { Ripple } from 'primeng/ripple';
import { Toast } from 'primeng/toast';

@Component({
  selector: 'app-pruebaPrimeNG',
  imports: [ButtonModule, Toast, Ripple],
  providers: [MessageService],
  templateUrl: './pruebaPrimeNG.component.html',
  styleUrls: ['./pruebaPrimeNG.component.css']
})
export class PruebaPrimeNGComponent implements OnInit {

  constructor(private messageService: MessageService) {}

    showSuccess() {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'UP2Play application is running!' });
    }

  ngOnInit() {
  }

}
