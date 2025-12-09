import { Component, input, output, signal, effect, OnInit, inject, Injector } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Usuario } from '../../../../shared/models/usuario.model';
import { Perfil } from '../../../../shared/models/Perfil';
import { AvatarPipe } from '../../../../shared/pipes/avatar-pipe';

@Component({
  selector: 'app-avatar-profile',
  standalone: true,
  imports: [AvatarPipe, CommonModule],
  templateUrl: './avatar-profile.html',
  styleUrl: './avatar-profile.scss'
})
export class AvatarProfile implements OnInit {
  usuario = input<Usuario | null>(null);
  perfil = input<Perfil | null>(null);

  cambiosAvatar = output<number>();

  avatars = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  selectedAvatarId = signal<number | null>(null);

  private injector = inject(Injector);

  ngOnInit(): void {
    //Para saber cuál es el avatar y si cambia desde el padre
    effect(() => {
      const currentImagen = this.perfil()?.imagen;
      if (currentImagen) {
        this.selectedAvatarId.set(currentImagen); //Borde verde 
      }
    }, { injector: this.injector });
  }

  seleccionarAvatar(id: number): void {
    this.selectedAvatarId.set(id);
    this.cambiosAvatar.emit(id);
  }
}