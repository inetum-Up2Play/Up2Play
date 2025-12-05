import { Component, inject, OnInit, signal } from '@angular/core';
import { Header } from '../../../../core/layout/header/header';
import { FormProfile } from '../../components/form-profile/form-profile';
import { AvatarProfile } from '../../components/avatar-profile/avatar-profile';
import { ButtonModule } from 'primeng/button';
import { Usuario } from '../../../../shared/models/usuario.model';
import { PerfilService } from '../../../../core/services/perfil/perfil-service';
import { UserService } from '../../../../core/services/user/user-service';
import { AuthService } from '../../../../core/services/auth/auth-service';

@Component({
  selector: 'app-profile',
  imports: [
    Header,
    FormProfile,
    AvatarProfile,
    ButtonModule,
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile {
  private userService = inject(UserService);
  private perfilService = inject(PerfilService);
  private authService = inject(AuthService);
  usuario = signal<Usuario | null>(null);

  ngOnInit(): void {
    this.userService.getUsuario().subscribe({
      next: (data) => {
        this.usuario.set(data);
      },
      error: (err) => {
        console.error('Error cargando el usuario', err);
      },
    });
  }

  eliminarCuenta() {
    this.authService.logout();
    this.userService.eliminarUsuario();
    //this.perfilService.eliminarPerfil();

  }
}
