import { Component } from '@angular/core';
import { Header } from '../../core/layout/header/header';
import { Calendar } from './components/calendar/calendar';

@Component({
  selector: 'app-home',
  imports: [Header, Calendar],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {

}
