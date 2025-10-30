import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { UserService } from '../../../../core/services/user-service';

@Component({
  selector: 'app-usuario',
  imports: [],
  templateUrl: './usuario.html',
  styleUrl: './usuario.scss'
})

export class UsuarioComponent implements OnInit {
  usuarios: Usuario[] = [];
 
  constructor(private usuarioService: UserService) {}
 
  ngOnInit(): void {
    this.usuarioService.obtenerUsuarios().subscribe(data => {
      this.usuarios = data;
    });
  }
}

