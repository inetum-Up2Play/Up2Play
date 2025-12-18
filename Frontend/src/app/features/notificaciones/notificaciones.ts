import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; // Necesario para filtros

import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { MultiSelectModule } from 'primeng/multiselect';
import { AccordionModule } from 'primeng/accordion';


// Tus servicios y modelos
import { Notificacion } from '../../shared/models/Notificacion';
import { NotificacionesService } from '../../core/services/notificaciones/notificaciones-service';
import { Header } from '../../core/layout/header/header';
import { Footer } from '../../core/layout/footer/footer';

@Component({
  selector: 'app-notificaciones',
  imports: [AccordionModule, TableModule, TagModule, IconFieldModule, InputTextModule, InputIconModule, MultiSelectModule, SelectModule, HttpClientModule, CommonModule, ButtonModule, Header, Footer],
  //providers: [CustomerService],
  templateUrl: './notificaciones.html',
  styleUrl: './notificaciones.scss',
})

export class Notificaciones implements OnInit {
  private notificacionesService = inject(NotificacionesService);

  notificaciones = signal<Notificacion[]>([]);

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

    // this.notificacionesService.getNotificaciones().subscribe({
    //   next: (data) => {
    //     // Aquí podrías transformar fechas de string a Date si la tabla lo requiere para ordenación compleja
    //     // data.forEach(n => n.dateObj = new Date(n.fecha));
    //     this.notificaciones.set(data);
    //     this.loading = false;
    //   },
    //   error: (err) => {
    //     console.error('Error cargando notificaciones', err);
    //     this.loading = false;
    //   }
    // });

    // DATOS DE EJEMPLO (MOCK)
    const mockData: Notificacion[] = [
      {
        id: 1,
        titulo: 'Inscripción confirmada',
        descripcion: 'Te has inscrito correctamente en la actividad "Torneo de Pádel Mix". No olvides traer tu pala.',
        fecha: '2023-11-20',
        leido: false,
        estadoNotificacion: 'INSCRITO'
      },
      {
        id: 2,
        titulo: 'Pago realizado con éxito',
        descripcion: 'Hemos recibido tu pago de 12.50€ para la reserva de la pista de tenis.',
        fecha: '2023-11-19',
        leido: true,
        estadoNotificacion: 'PAGADO'
      },
      {
        id: 3,
        titulo: 'Actividad cancelada',
        descripcion: 'Lo sentimos, la clase de Yoga al atardecer ha sido cancelada por el organizador debido al mal tiempo.',
        fecha: '2023-11-18',
        leido: false,
        estadoNotificacion: 'CANCELADA'
      },
      {
        id: 4,
        titulo: 'Modificación en tu actividad',
        descripcion: 'La hora de inicio de "Senderismo: Ruta del Cister" se ha retrasado 30 minutos.',
        fecha: '2023-11-15',
        leido: true,
        estadoNotificacion: 'EDITADA'
      },
      {
        id: 5,
        titulo: 'Te has desapuntado',
        descripcion: 'Has abandonado la actividad "Crossfit Intensivo". Tu plaza ha quedado libre.',
        fecha: '2023-11-10',
        leido: true,
        estadoNotificacion: 'DESAPUNTADO'
      }
    ];

    setTimeout(() => {
      const datosTransformados = mockData.map(datos => ({
        ...datos,
        fecha: new Date(datos.fecha)
      }));

      this.notificaciones.set(datosTransformados as unknown as Notificacion[]);
      this.loading = false;
    }, 500);

  }

  clear(table: Table) {
    table.clear();
  }

  getSeverity(tipo: string): "success" | "info" | "warn" | "danger" | "secondary" | "contrast" | undefined {
    switch (tipo) {
      case 'INSCRITO':
      case 'CREADA':
      case 'PAGADO':
        return 'success'; // Verde

      case 'EDITADA':
      case 'ACTUALIZADO':
        return 'info'; // Azul

      case 'DESAPUNTADO':
        return 'warn'; // Amarillo

      case 'CANCELADA':
        return 'danger'; // Rojo 

      default:
        return 'secondary'; // Gris
    }
  }

  marcarComoLeida(notificacion: Notificacion) {
    if (notificacion.leido) return;
    notificacion.leido = true;
    console.log('Marcar como leída:', notificacion.id, notificacion.titulo);
    // Aquí llamarías a tu servicio: this.notificacionesService.markAsRead(notificacion.id)...
  }

  eliminarNotificacion(notificacion: Notificacion) {
    const actual = this.notificaciones().filter(n => n.id !== notificacion.id);
    this.notificaciones.set(actual);
    console.log('Eliminar:', notificacion.id, notificacion.titulo);
    // Aquí llamarías a tu servicio para borrar
  }


}

