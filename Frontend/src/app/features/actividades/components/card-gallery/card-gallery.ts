import { Component, HostListener, inject, input, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';


import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { DataViewModule } from 'primeng/dataview';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { MultiSelect } from 'primeng/multiselect';

import { UserService } from '../../../../core/services/user/user-service';
import { ActService } from '../../../../core/services/actividad/act-service';
import { ActUpdateService } from '../../../../core/services/actividad/act-update-service';
import { EmptyActivities } from '../empty-activities/empty-activities';
import { ErrorService } from '../../../../core/services/error/error-service';
import { ActivityCard } from '../activity-card/activity-card';
import { DeporteImgPipe } from '../../pipes/deporte-img-pipe';

@Component({
  selector: 'app-card-gallery',
  imports: [
    EmptyActivities,
    CommonModule,
    MessageModule,
    ButtonModule,
    DataViewModule,
    SelectButtonModule,
    FormsModule,
    ActivityCard,
    ToastModule,
    DeporteImgPipe,
    ConfirmDialog,
    MultiSelect,
    InputTextModule,
    IconField,
    InputIcon,
  ],
  providers: [ConfirmationService],
  templateUrl: './card-gallery.html',
  styleUrl: './card-gallery.scss',
})

export class CardGallery {
  private actService = inject(ActService);
  private actUpdateService = inject(ActUpdateService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
  private errorService = inject(ErrorService);
  private router = inject(Router);
  private userService = inject(UserService)

  private manejarError(codigo: number) {
    const mensaje = this.errorService.getMensajeError(codigo);
    this.errorService.showError(mensaje);
  }

  tipo = input.required<string>();

  // Configuración del DataView
  layout: 'list' | 'grid' = 'grid';
  options: any[] = ['list', 'grid'];
  activities: any[] = [];
  visibleActivities: any[] = [];
  pageSize = 8;
  currentPage = 1;

  filteredActivities: any[] = [];
  filterNombre: string = '';
  filterDeporte: string[] = [];

  userId: number | null = null;

  loading = signal(false);

  ngOnInit() {
    this.calcularPageSize();
    this.obtenerUsuarioActual();
    this.cargarActividades();

    // Suscribirse a cambios externos (ej: al borrar/crear una actividad)
    this.actUpdateService.update$.subscribe(() => {
      this.cargarActividades();
    });
  }

  removeDeporte(deporteToRemove: string) {
    // Filtramos el array para quitar el que hemos pulsado
    this.filterDeporte = this.filterDeporte.filter(
      (d) => d !== deporteToRemove,
    );
    this.applyFilters();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.calcularPageSize();
  }

  calcularPageSize() {
    const width = window.innerWidth;
    let nuevoSize = 8;

    if (width >= 1536) {
      nuevoSize = 8;
    } else if (width >= 1280) {
      nuevoSize = 9;
    } else {
      nuevoSize = 8;
    }

    if (this.pageSize !== nuevoSize) {
      this.pageSize = nuevoSize;
      if (this.filteredActivities.length > 0) {
        this.updateVisibleActivities();
      }
    }
  }

  cargarActividades() {
    this.currentPage = 1;

    let llamarservicio: Observable<any[]>;

    switch (this.tipo()) {
      case 'explora-apuntate':
        llamarservicio = this.actService.listarActividadesNoApuntadas();
        break;
      case 'mis-actividades':
        llamarservicio = this.actService.listarActividadesCreadas();
        break;
      case 'proximos-planes':
        llamarservicio = this.actService.listarActividadesApuntadasPendientes();
        break;
      default:
        console.warn('Tipo de galería desconocido:', this.tipo());
        return;
    }

    llamarservicio.subscribe({
      next: (data) => {
        this.activities = data;
        this.filteredActivities = [...data]; // Inicializar filteredActivities
        this.applyFilters(); // Aplicar filtros iniciales (si hay)
      },
      error: (err) => {
        console.error('Error cargando actividades:', err);
        this.activities = [];
        this.visibleActivities = [];
      },
    });
  }

  /*=== LÓGICA DE FILTROS ===*/
  applyFilters() {
    this.currentPage = 1; 

    this.filteredActivities = this.activities.filter((act) => {
      const matchNombre = this.filterNombre
        ? act.nombre.toLowerCase().includes(this.filterNombre.toLowerCase())
        : true;

      const matchDeporte = this.filterDeporte && this.filterDeporte.length > 0
        ? this.filterDeporte.includes(act.deporte)
        : true;

      return matchNombre && matchDeporte;
    });

    this.updateVisibleActivities();
  }

  clearFilters() {
    this.filterNombre = '';
    this.filterDeporte = [];
    this.applyFilters(); 
  }

  /*=== LÓGICA SI EL USUARIO ES CREADOR ===*/
  obtenerUsuarioActual() {
    this.userService.getUsuario().subscribe({
      next: (user) => this.userId = user.id,
      error: () => this.userId = null
    });
  }

  esCreador(activity: any): boolean {
    return this.userId !== null && activity.usuarioCreadorId === this.userId;
  }

  eliminar( id: number) {
    console.log('prova');
    this.confirmationService.confirm({
      message:
        '¿Seguro que quieres eliminar esta actividad? Si es de pago, se procederá al reembolso.',
      header: '¡Cuidado!',
      icon: 'pi pi-info-circle',
      rejectLabel: 'Cancelar',
      rejectButtonProps: {
        label: 'Cancelar',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Eliminar',
        severity: 'danger',
      },
      accept: () => {
        this.loading.set(true);
        this.actService.deleteActividad(id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Actividad eliminada',
              detail: 'Actividad eliminada correctamente',
            });
            this.actUpdateService.notifyUpdate();
            this.loading.set(false);
          },

          error: (codigo) => {
            this.loading.set(false);
            this.manejarError(codigo)
          },
        });
      },
      reject: () => {
        this.loading.set(false);
        this.messageService.add({
          severity: 'warn',
          summary: 'Rechazado',
          detail: 'Has cancelado la eliminación',
        });
      },
    });
  }

  updateVisibleActivities() {
    const end = this.pageSize * this.currentPage;
    this.visibleActivities = this.filteredActivities.slice(0, end);
  }

  loadMore() {
    this.currentPage++;
    this.updateVisibleActivities();
  }

  extraerHora(fecha: string): string {
    if (!fecha) return '';
    return fecha.includes('T') ? fecha.split('T')[1].substring(0, 5) : '';
  }

  extraerFecha(fecha: string): string {
    if (!fecha) return '';
    return fecha.includes('T') ? fecha.split('T')[0] : '';
  }

  redirigirInfoActividad(id: number | string) {
    return this.router.navigate(['/actividades/info-actividad', id]);
  }

  // Opciones para el dropdown (puedes llenarlo dinámicamente o estático)
  deportesOptions = [
    { label: 'Atletismo', value: 'Atletismo' },
    { label: 'Balonmano', value: 'Balonmano' },
    { label: 'Basquet', value: 'Basquet' },
    { label: 'Béisbol', value: 'Béisbol' },
    { label: 'Billar', value: 'Billar' },
    { label: 'Boxeo', value: 'Boxeo' },
    { label: 'Críquet', value: 'Críquet' },
    { label: 'Ciclismo', value: 'Ciclismo' },
    { label: 'Escalada', value: 'Escalada' },
    { label: 'Esgrima', value: 'Esgrima' },
    { label: 'Esquí', value: 'Esquí' },
    { label: 'Futbol', value: 'Futbol' },
    { label: 'Gimnasia', value: 'Gimnasia' },
    { label: 'Golf', value: 'Golf' },
    { label: 'Hockey', value: 'Hockey' },
    { label: 'Artes Marciales', value: 'Artes Marciales' },
    { label: 'Natación', value: 'Natación' },
    { label: 'Patinaje', value: 'Patinaje' },
    { label: 'Ping Pong', value: 'Ping Pong' },
    { label: 'Piragüismo', value: 'Piragüismo' },
    { label: 'Rugby', value: 'Rugby' },
    { label: 'Remo', value: 'Remo' },
    { label: 'Snowboard', value: 'Snowboard' },
    { label: 'Surf', value: 'Surf' },
    { label: 'Tenis', value: 'Tenis' },
    { label: 'Triatlón', value: 'Triatlón' },
    { label: 'Voleibol', value: 'Voleibol' },
    { label: 'Waterpolo', value: 'Waterpolo' },
    { label: 'Ajedrez', value: 'Ajedrez' },
    { label: 'Badminton', value: 'Badminton' },
    { label: 'Crossfit', value: 'Crossfit' },
    { label: 'Danza Deportiva', value: 'Danza Deportiva' },
    { label: 'Entrenamiento de fuerza', value: 'Entrenamiento de fuerza' },
    { label: 'Equitación', value: 'Equitación' },
    { label: 'Fútbol Americano', value: 'Fútbol Americano' },
    { label: 'Lucha Libre', value: 'Lucha Libre' },
    { label: 'Motocross', value: 'Motocross' },
    { label: 'Padel', value: 'Padel' },
    { label: 'Parkour', value: 'Parkour' },
    { label: 'Skateboarding', value: 'Skateboarding' },
    { label: 'Squash', value: 'Squash' },
    { label: 'Tiro con Arco', value: 'Tiro con Arco' },
    { label: 'Frisbee', value: 'Frisbee' },
    { label: 'Senderismo', value: 'Senderismo' },
    { label: 'Running', value: 'Running' },
    { label: 'Petanca', value: 'Petanca' },
  ];
}
