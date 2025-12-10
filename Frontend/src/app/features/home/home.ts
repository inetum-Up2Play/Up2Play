import { Component } from '@angular/core';
import { Header } from '../../core/layout/header/header';
import { Footer } from '../../core/layout/footer/footer';

@Component({
  selector: 'app-home',
  imports: [Header, Footer],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {

}
