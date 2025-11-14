import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { Ripple } from 'primeng/ripple';
import { Toast } from 'primeng/toast';
import { ActivityCard } from "../../actividades/components/activity-card/activity-card";
import { InfoActividad } from '../../actividades/pages/info-actividad/info-actividad';

@Component({
  selector: 'app-pruebaPrimeNG',
  imports: [ButtonModule, Toast, Ripple, ActivityCard, InfoActividad],
  providers: [MessageService],
  templateUrl: './pruebaPrimeNG.component.html',
  styleUrls: ['./pruebaPrimeNG.component.css']
})
export class PruebaPrimeNGComponent implements OnInit {

  activities = [
    {
      id: 1,
      title: 'Running por la playa',
      date: '2025-11-20',
      time: '08:00',
      location: 'Playa de Tokyo',
      imageUrl: 'https://media.gq.com.mx/photos/660304abed6388a71e23c80d/16:9/w_2560%2Cc_limit/GettyImages-629586734.jpg'
    },
    {
      id: 2,
      title: 'Yoga en el parque',
      date: '2025-11-21',
      time: '10:00',
      location: 'Parque Central',
      imageUrl: 'https://images.unsplash.com/photo-1689308271305-58e75832289b?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDE3fHx8ZW58MHx8fHx8'
    }
  ];

  constructor(private messageService: MessageService) { }

  showSuccess() {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'UP2Play application is running!' });
  }

  ngOnInit() {
  }

}
