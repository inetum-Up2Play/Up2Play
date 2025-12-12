import { Component, inject } from '@angular/core';
import { Header } from '../../core/layout/header/header';
import { Footer } from '../../core/layout/footer/footer';
import { Calendar } from './components/calendar/calendar';
import { PerfilService } from '../../core/services/perfil/perfil-service';
import { AvatarPipe } from '../../shared/pipes/avatar-pipe';
import { ProximosPlanes } from './components/proximos-planes/proximos-planes';

@Component({
    selector: 'app-home',
    imports: [Header, Footer, Calendar, ProximosPlanes, AvatarPipe],
    templateUrl: './home.html',
    styleUrl: './home.scss'
  })
  export class Home {
    public perfilService = inject(PerfilService);
  }
