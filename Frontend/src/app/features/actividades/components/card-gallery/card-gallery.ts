import { Component, HostListener, inject, input } from '@angular/core';
import { ActService } from '../../../../core/services/actividad/act-service';
import { ActUpdateService } from '../../../../core/services/actividad/act-update-service';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { CommonModule } from '@angular/common';
import { EmptyActivities } from '../empty-activities/empty-activities';
import { DataViewModule } from 'primeng/dataview';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';
import { ActivityCard } from '../activity-card/activity-card';
import { DeporteImgPipe } from '../../pipes/deporte-img-pipe';
import { ToastModule } from 'primeng/toast';
import { Observable } from 'rxjs';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
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
    InputTextModule,
    IconField,
    InputIcon,
    ActivityCard,
    ToastModule,
    DeporteImgPipe,
  ],
  templateUrl: './card-gallery.html',
  styleUrl: './card-gallery.scss',
})
export class CardGallery {
  private actService = inject(ActService);
  private actUpdateService = inject(ActUpdateService);

  tipo = input.required<string>();

  // Configuración del DataView
  layout: 'list' | 'grid' = 'grid';
  options: any[] = ['list', 'grid'];

  activities: any[] = [];
  filteredActivities: any[] = []; // Actividades después de filtrar
  visibleActivities: any[] = []; // Actividades visibles (paginación)
  
  pageSize = 8;
  currentPage = 1;
  noHayActividades = true;

  filterNombre: string = '';

  ngOnInit() {
    this.calcularPageSize();
    this.cargarActividades();

    // Suscribirse a cambios externos (ej: al borrar/crear una actividad)
    this.actUpdateService.update$.subscribe(() => {
      this.cargarActividades();
    });
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
      nuevoSize = 9; // Ajuste para pantallas grandes
    } else {
      nuevoSize = 8;
    }

    // Solo actualizamos si cambia el tamaño 
    if (this.pageSize !== nuevoSize) {
      this.pageSize = nuevoSize;
      if (this.filteredActivities.length > 0) {
        this.updateVisibleActivities();
      }
    }
  }

  cargarActividades() {
    this.currentPage = 1; 
    this.noHayActividades = true; 

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
        this.noHayActividades = this.activities.length === 0;
        this.applyFilters(); // Aplicar filtros iniciales (si hay)
      },
      error: (err) => {
        console.error('Error cargando actividades:', err);
        this.activities = [];
        this.filteredActivities = [];
        this.visibleActivities = [];
        this.noHayActividades = true;
      },
    });
  }

  // Lógica de Filtrado
  applyFilters() {
    this.currentPage = 1; // Resetear paginación al filtrar
    
    // Filtrar las actividades
    this.filteredActivities = this.activities.filter((act) => {
      const matchNombre = this.filterNombre
        ? act.nombre.toLowerCase().includes(this.filterNombre.toLowerCase())
        : true;

      return matchNombre;
    });

    // Actualizar actividades visibles
    this.updateVisibleActivities();
  }

  clearFilters() {
    this.filterNombre = '';
    this.applyFilters(); // Aplicar filtro vacío
  }

  updateVisibleActivities() {
    // Calcular el índice final basado en la página actual
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
}