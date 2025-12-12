import { Component } from '@angular/core';
import { Header } from '../../core/layout/header/header';
import { Footer } from '../../core/layout/footer/footer';
import { Calendar } from './components/calendar/calendar';
import { CarrouselDeportes } from './components/carrousel-deportes/carrousel-deportes';

@Component({
  selector: 'app-home',
  imports: [Header, Footer, Calendar,CarrouselDeportes],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {

}
