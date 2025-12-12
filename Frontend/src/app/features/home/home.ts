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

  public perfilService = inject(PerfilService);
  private userService = inject(UserService);
  private actService = inject(ActService);

  private userEmailSignal = signal<string>('');
  public currentUsuario = toSignal(this.userService.getUsuario(), { initialValue: null });

  public planesUnidos = signal<number>(0);
  public planesCreados = signal<number>(0); 

  private cargarDatos(): void {
    // 1. Cargar Actividades Apuntadas
    this.actService.listarActividadesApuntadas().subscribe({
      next: (data) => {
        const cantidad = data ? data.length : 0;
        this.planesUnidos.set(cantidad);
      }
    });

    // 2. Cargar Actividades Creadas
    this.actService.listarActividadesCreadas().subscribe({
      next: (data) => {
        const cantidad = data ? data.length : 0;
        this.planesCreados.set(cantidad);
      }
    });
    
  }

  ngOnInit(): void {
    this.cargarDatos();
  }

}
