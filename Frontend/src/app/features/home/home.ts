import { Component, inject } from '@angular/core';
import { Header } from '../../core/layout/header/header';
import { Footer } from '../../core/layout/footer/footer';
import { Calendar } from './components/calendar/calendar';
import { PerfilService } from '../../core/services/perfil/perfil-service';
import { AvatarPipe } from '../../shared/pipes/avatar-pipe';

@Component({
  selector: 'app-home',
  imports: [Header, Footer, Calendar, AvatarPipe],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {
    public perfilService = inject(PerfilService);

}
