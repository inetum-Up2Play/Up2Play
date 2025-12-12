import { Component, inject, OnInit, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Header } from '../../core/layout/header/header';
import { Footer } from '../../core/layout/footer/footer';
import { Calendar } from './components/calendar/calendar';
import { PerfilService } from '../../core/services/perfil/perfil-service';
import { AvatarPipe } from '../../shared/pipes/avatar-pipe';
import { UserService } from '../../core/services/user/user-service';
import { Usuario } from '../../shared/models/usuario.model';
import { ActService } from '../../core/services/actividad/act-service';

@Component({
  selector: 'app-home',
  imports: [Header, Footer, Calendar, AvatarPipe],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home implements OnInit {

  private perfilService = inject(PerfilService);
  private userService = inject(UserService);
  private actService = inject(ActService);

  private userEmailSignal = signal<string>('');
  public currentUser = toSignal(
    this.userService.getUsuario(), 
    { initialValue: null } // Usuario | null
  );
  
  //public actApuntadas = this.actService.listarActividadesApuntadas().length();

  ngOnInit(): void {
    const user = this.currentUser();
    if (user) {
      this.userEmailSignal.set(user.email);
    }
  }






}
