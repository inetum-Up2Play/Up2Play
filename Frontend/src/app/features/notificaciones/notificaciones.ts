import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { MultiSelectModule } from 'primeng/multiselect';
import { AccordionModule } from 'primeng/accordion';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

// Tus servicios y modelos
import { Notificacion } from '../../shared/models/Notificacion';
import { NotificacionesService } from '../../core/services/notificaciones/notificaciones-service';
import { Header } from '../../core/layout/header/header';
import { Footer } from '../../core/layout/footer/footer';

@Component({
  selector: 'app-notificaciones',
  imports: [ToastModule, AccordionModule, TableModule, TagModule, IconFieldModule, InputTextModule, InputIconModule, MultiSelectModule, SelectModule, HttpClientModule, CommonModule, ButtonModule, Header, Footer],
  templateUrl: './notificaciones.html',
  styleUrl: './notificaciones.scss',
})

export class Notificaciones implements OnInit {
  private notificacionesService = inject(NotificacionesService);
  private messageService = inject(MessageService);

  notificaciones = signal<Notificacion[]>([]);
  errorMsg = '';
  loading: boolean = true;
  tipos: any[] = [];
  expandRows = {};
  activityValues: number[] = [0, 100];

  ngOnInit() {
    this.configurarFiltros();
    this.configurarDatos();
  }

  configurarFiltros() {
    this.tipos = [
      { label: 'INSCRITO', value: 'INSCRITO' },
      { label: 'PAGADO', value: 'PAGADO' },
      { label: 'CREADA', value: 'CREADA' },
      { label: 'ACTUALIZADO', value: 'ACTUALIZADO' },
      { label: 'EDITADA', value: 'EDITADA' },
      { label: 'DESAPUNTADO', value: 'DESAPUNTADO' },
      { label: 'CANCELADA', value: 'CANCELADA' },
    ];
  }

  configurarDatos() {
    this.loading = true;

    this.notificacionesService.getNotificacionesUsuario().subscribe({
      next: (data) => {
        // Ordenar por fecha DESC (más recientes primero)
        const ordenadas = [...(data ?? [])].sort((a, b) => {
          const fa = new Date(a.fecha as any).getTime();
          const fb = new Date(b.fecha as any).getTime();
          return fb - fa;
        });

        this.notificaciones.set(ordenadas);
        this.loading = false;
      },

      error: (err) => {
        console.error('❌ Error cargando notificaciones:', err);
      }
    });

  }

  clear(table: Table) {
    table.clear();
  }

  // Definir tipo de la notificación
  getSeverity(tipo: string): "success" | "info" | "warn" | "danger" | "secondary" | "contrast" | undefined {
    switch (tipo) {
      // VerdeS
      case 'INSCRITO':
      case 'CREADA':
      case 'PAGADO':
        return 'success';
      // Azules
      case 'EDITADA':
      case 'ACTUALIZADO':
        return 'info';
      // Amarillos
      case 'DESAPUNTADO':
        return 'warn';
      // Rojos 
      case 'CANCELADA':
        return 'danger';
      // Gris
      default:
        return 'secondary';
    }
  }


  marcarComoLeida(notificacion: Notificacion): void {
    if (notificacion.leido) return;

    this.notificacionesService.marcarComoLeida(notificacion.id).subscribe({
      next: (res) => {

        // Actualiza la UI solo si el backend fue bien
        notificacion.leido = true;
      },
      error: (err) => {
        console.error('❌ Error al marcar como leída:', err);
      }
    });
  }

  eliminarNotificacion(notificacion: Notificacion): void {
    this.notificacionesService.eliminarNotificacion(notificacion.id).subscribe({
      next: (res) => {

        // Quitar de la lista una vez confirmado
        const actual = this.notificaciones().filter(n => n.id !== notificacion.id);
        this.notificaciones.set(actual);

        this.messageService.add({
          severity: 'success',
          summary: 'Notificación eliminada',
          detail: res?.message ?? `Se eliminó: ${notificacion.titulo}`,
          life: 2500
        });

      },
      error: (err) => {
        console.error('❌ Error al eliminar notificación:', err);

        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err?.message ?? 'No se pudo eliminar la notificación',
          life: 3500
        });

      }
    });
  }

}