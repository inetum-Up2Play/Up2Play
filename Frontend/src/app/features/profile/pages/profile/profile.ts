import {
  Component,
  inject,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';

import { Header } from '../../../../core/layout/header/header';
import { CambiarPasswordDto, FormProfile } from '../../components/form-profile/form-profile';
import { AvatarProfile } from '../../components/avatar-profile/avatar-profile';
import { Usuario } from '../../../../shared/models/usuario.model';
import { PerfilService } from '../../../../core/services/perfil/perfil-service';
import { UserService } from '../../../../core/services/user/user-service';
import { AuthService } from '../../../../core/services/auth/auth-service';
import { Perfil } from '../../../../shared/models/Perfil';
import { ErrorService } from '../../../../core/services/error/error-service';
import { ToastModule } from 'primeng/toast';
import { MessageModule } from 'primeng/message';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-profile',
  imports: [Header, FormProfile, AvatarProfile, ButtonModule, ToastModule, MessageModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
  providers: [MessageService]
})
export class Profile implements OnInit {
  private userService = inject(UserService);
  private perfilService = inject(PerfilService);
  private authService = inject(AuthService);
  private errorService = inject(ErrorService);
  private messageService = inject(MessageService);

  usuario = signal<Usuario | null>(null);
  perfil = signal<Perfil | null>(null);

  pwdVisible = false;

  private cargarDatos(): void {
    this.userService.getUsuario().subscribe({
      next: (datosUsuario) => {
        this.usuario.set(datosUsuario || null);
      },
      error: (err) => {
        console.error('Error cargando el usuario', err);
        this.errorService.showError(err);
      },
    });

    this.perfilService.getPerfil().subscribe({
      next: (datosPerfil) => {
        this.perfil.set(datosPerfil);
        console.log('Perfil cargado:', this.perfil());
      },
      error: (err) => {
        console.error('Error cargando el perfil', err);
        this.errorService.showError(err);
      },
    });
  }

  ngOnInit(): void {
    this.cargarDatos();
  }

  onCambiosPerfil(datosFormulario: Perfil) {
    const perfilActual = this.perfil();

    const perfilModificado = { ...perfilActual, ...datosFormulario };

    this.perfilService.editarPerfil(perfilModificado.id, perfilModificado).subscribe({
      next: () => {
        this.perfil.set(perfilModificado);
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Perfil actualizado correctamente' });
      },
      error: (err) => {
        console.error('Error editando el perfil', err);
        this.errorService.showError(err);
      }
    });
  }

  onCambiosAvatar(numAvatar: number) {
    const perfilActual = this.perfil();

    if (!perfilActual) {
      console.error('❌ ERROR: Intentando cambiar avatar sin perfil cargado.');
      return;
    }

    const perfilModificado = { ...perfilActual, imagenPerfil: numAvatar };

    this.perfilService.editarPerfil(perfilModificado.id, perfilModificado).subscribe({
      next: () => {
        console.log('✅ Avatar guardado en BD correctamente.');
        this.perfil.set(perfilModificado);
      },
      error: (err) => {
        console.error('Error editando el avatar del usuario', err);
        this.errorService.showError(err);
      }
    });
  }


  // Recibe el payload del hijo y llama al servicio
  onChangePassword(payload: CambiarPasswordDto, child?: any) {    
    this.userService.cambiarContraseñaPerfil(payload)
      .subscribe({
        next: () => {
          // Notificación
          this.messageService.add({ severity: 'success', summary: 'Contraseña actualizada', detail: 'Se ha cambiado correctamente' });
          this.pwdVisible = false;

          // Avisar al hijo que terminó, para que quite loading y cierre
          child?.onRequestFinished?.(true);
        },
        error: (err: HttpErrorResponse) => {
          const errorMsg = (err.error?.error ?? err.error?.message ?? 'Error desconocido');
          this.messageService.add({ severity: 'error', summary: 'Error al actualizar', detail: errorMsg });
          child?.onRequestFinished?.(false);
        }
      });
  }

eliminarCuenta() {
  this.userService.eliminarUsuario();
  this.authService.logout();
  //this.perfilService.eliminarPerfil();
}
}
