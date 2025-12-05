import {
  Component,
  inject,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { Header } from '../../../../core/layout/header/header';
import { FormProfile } from '../../components/form-profile/form-profile';
import { AvatarProfile } from '../../components/avatar-profile/avatar-profile';
import { ButtonModule } from 'primeng/button';
import { Usuario } from '../../../../shared/models/usuario.model';
import { PerfilService } from '../../../../core/services/perfil/perfil-service';
import { UserService } from '../../../../core/services/user/user-service';
import { AuthService } from '../../../../core/services/auth/auth-service';
import { Perfil } from '../../../../shared/models/Perfil';

@Component({
  selector: 'app-profile',
  imports: [Header, FormProfile, AvatarProfile, ButtonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile {
  private userService = inject(UserService);
  private perfilService = inject(PerfilService);
  private authService = inject(AuthService);

  usuario = signal<Usuario | null>(null);
  perfil = signal<Perfil | null>(null);
  perfilActualizado: Perfil = this.perfil()!; // el ! confia que mai sera null

  ngOnInit(): void {
    this.userService.getUsuario().subscribe({
      next: (datosUsuario) => {
        this.usuario.set(datosUsuario);
      },
      error: (err) => {
        console.error('Error cargando el usuario', err);
      },
    });

    this.perfilService.getPerfil().subscribe({
      next: (datosPerfil) => {
        this.perfil.set(datosPerfil);
      },
      error: (err) => {
        console.error('Error cargando el perfil', err);
      },
    });
  }

  onCambiosPerfil(guardarPerfil: Perfil) {
    this.perfilActualizado = guardarPerfil;

    this.perfilService.editarPerfil(this.perfilActualizado.id, this.perfilActualizado).subscribe({
      next: (res) => {
        console.error('Guardat');
        this.ngOnInit();

      },
      error: () => {
        console.error('Error editando el usuario');
      }
    });
  }

  onCambiosAvatar (numAvatar: number) {
    this.perfilActualizado.imagen = numAvatar;

    this.perfilService.editarPerfil(this.perfilActualizado.id, this.perfilActualizado).subscribe({
      next: (res) => {
        console.error('Guardat');
        this.ngOnInit();
      },
      error: () => {
        console.error('Error editando el usuario');
      }
    });
  }

  eliminarCuenta() {
    this.authService.logout();
    this.userService.eliminarUsuario();
    //this.perfilService.eliminarPerfil();
  }
}
