import { Component } from '@angular/core';
import { Header } from '../../core/layout/header/header';
import { Footer } from '../../core/layout/footer/footer';
import { Calendar } from './components/calendar/calendar';
import { ProximosPlanes } from './components/proximos-planes/proximos-planes';

@Component({
  selector: 'app-home',
  imports: [Header, Footer, Calendar, ProximosPlanes],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {

}
