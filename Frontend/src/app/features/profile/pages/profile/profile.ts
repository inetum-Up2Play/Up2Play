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
export class Profile implements OnInit {
  private userService = inject(UserService);
  private perfilService = inject(PerfilService);
  private authService = inject(AuthService);

  usuario = signal<Usuario | null>(null);
  perfil = signal<Perfil | null>(null);
  perfilActualizado: Perfil = this.perfil()!; // el ! confia que mai sera null

  private cargarDatos(): void {
      this.userService.getUsuario().subscribe({
          next: (datosUsuario) => {
              // Verificación defensiva antes de setear la señal
              console.log('PADRE: Datos Usuario recibidos:', datosUsuario); 
              if (datosUsuario) {
                  this.usuario.set(datosUsuario);
              } else {
                   // Si el usuario no existe, asignamos null
                   this.usuario.set(null); 
              }
          },
          error: (err) => {
              console.error('Error cargando el usuario', err);
          },
      });

      this.perfilService.getPerfil().subscribe({
          next: (datosPerfil) => {
              this.perfil.set(datosPerfil);
              // Inicializa perfilActualizado aquí, después de que los datos estén cargados
              this.perfilActualizado = datosPerfil;
              console.log(this.perfil());
          },
          error: (err) => {
              console.error('Error cargando el perfil', err);
          },
      });
  }

  ngOnInit(): void {
    this.cargarDatos();
  }

  onCambiosPerfil(guardarPerfil: Perfil) {
    this.perfilActualizado = guardarPerfil;

    this.perfilService.editarPerfil(this.perfilActualizado.id, this.perfilActualizado).subscribe({
      next: (res) => {
        console.error('Guardat');
        this.cargarDatos();
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
        this.cargarDatos();
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
