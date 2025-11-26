import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-empty-activities',
  imports: [],
  templateUrl: './empty-activities.html',
  styleUrl: './empty-activities.scss'
})
export class EmptyActivities {
  //icono
  @Input() icon: string = ''; 
  //título    
  @Input() title: string = '';
  //subtitulo    
  @Input() message: string = '';
}
