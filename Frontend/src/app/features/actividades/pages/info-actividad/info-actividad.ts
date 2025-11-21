import { Component, signal, inject, AfterViewInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { RatingModule } from 'primeng/rating';
import { InputIconModule } from 'primeng/inputicon';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { MessageModule } from 'primeng/message';

import { Actividad } from '../../../../core/models/Actividad';
import { ActService } from '../../../../core/services/actividad/act-service';
import { Header } from '../../../../core/layout/header/header';
import { DeporteImgPipe } from '../../pipes/deporte-img-pipe';
import { ErrorService } from '../../../../core/services/error/error-service';

import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import Zoom from 'ol/control/Zoom';
import { Style, Icon } from 'ol/style';

@Component({
  selector: 'app-info-actividad',
  imports: [CardModule, DividerModule, RatingModule, InputIconModule, FormsModule, ReactiveFormsModule, Header, ToastModule, MessageModule, DeporteImgPipe],
  templateUrl: './info-actividad.html',
  styleUrls: ['./info-actividad.scss'],
})
export class InfoActividad implements AfterViewInit {
  actividad = signal<Actividad | null>(null);
  apuntado = signal<boolean>(false);
  isCreador = signal<boolean>(false);

  private messageService = inject(MessageService);
  private actService = inject(ActService);
  private errorService = inject(ErrorService);
  private router = inject(Router);


  actividadId: number;

  act = {
    ubicacion: '',
  };

  constructor(private route: ActivatedRoute, private http: HttpClient) {
    this.actividadId = Number(route.snapshot.paramMap.get('id'));
  }

  ngAfterViewInit(): void {
    this.http
      .get<any>(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          this.act.ubicacion
        )}`
      )
      .subscribe((results) => {
        if (results.length > 0) {
          const lat = parseFloat(results[0].lat);
          const lon = parseFloat(results[0].lon);
          this.initMap(lat, lon);
        }
      });
  }

  initMap(lat: number, lon: number): void {
    const marker = new Feature({
      geometry: new Point(fromLonLat([lon, lat])),
    });

    marker.setStyle(
      new Style({
        image: new Icon({
          src: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
          anchor: [0.5, 1],
          scale: 0.08,
        }),
      })
    );

    const vectorLayer = new VectorLayer({
      source: new VectorSource({
        features: [marker],
      }),
    });

    // Control de zoom personalizado

    const zoomControl = new Zoom({
      className: 'custom-zoom',
      zoomInLabel: '',
      zoomOutLabel: '',
      zoomInTipLabel: 'Acercar',
      zoomOutTipLabel: 'Alejar',
    });

    // Inicialización del mapa
    const map = new Map({
      target: 'map',
      layers: [
        new TileLayer({
          source: new OSM({
            attributions: 'Mapa por Up2Play',
          }),
        }),
        vectorLayer,
      ],
      view: new View({
        center: fromLonLat([lon, lat]),
        zoom: 17,
      }),
      controls: [zoomControl], // Usamos nuestro control personalizado
    });
  }

  ngOnInit(): void {
    if (!this.actividadId || Number.isNaN(this.actividadId)) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atención',
        detail: 'ID de actividad inválido',
      });
      return;
    }

    this.actService.getActividad(this.actividadId).subscribe({
      next: (act) => {
        this.actividad.set(act);
        console.log('Actividad cargada:', act);

        // Actualizamos el rating
        this.formRating.get('rating')?.setValue(this.getNivelValue(act.nivel));

        // Ahora que tenemos la ubicación, llamamos a Nominatim
        if (act.ubicacion) {
          this.http
            .get<any>(
              `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
                act.ubicacion
              )}`
            )
            .subscribe((results) => {
              if (results.length > 0) {
                const lat = parseFloat(results[0].lat);
                const lon = parseFloat(results[0].lon);
                this.initMap(lat, lon);
              }
            });
        }
      },
      error: (e) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: e ?? 'No se pudo cargar la actividad',
        });
      },
    });
    // Consultar si el usuario está apuntado
    this.actService.estoyApuntado(this.actividadId).subscribe(flag => this.apuntado.set(flag));

    // Consultar si el usuario es el creador de la actividad y actualizar el signal
    this.actService.comprobarCreador(this.actividadId).subscribe(flag => this.isCreador.set(flag));
  }

  //Usamos el p-rating como un form
  formRating = new FormGroup({
    rating: new FormControl(0),
  });

  //Método para indicar las banderas según nivel
  getNivelValue(nivel: string): number {
    const map: Record<string, number> = {
      INICIADO: 1,
      PRINCIPIANTE: 2,
      INTERMEDIO: 3,
      AVANZADO: 4,
      EXPERTO: 5,
    };
    return map[nivel] || 0; // Devuelve 0 si no coincide
  }

  extraerHora(fecha: string): string {
    if (!fecha) return '';
    return fecha.includes('T') ? fecha.split('T')[1].substring(0, 5) : '';
  }

  extraerFecha(fecha: string): string {
    if (!fecha) return '';
    return fecha.includes('T') ? fecha.split('T')[0] : '';
  }

  unirse(): void {
    const act = this.actividad();
    if (!act?.id) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atención',
        detail: 'Actividad no cargada',
      });
      return;
    }

    this.actService.unirteActividad(act.id).subscribe({
      next: () => {
        // Actualización
        this.actividad.set({
          ...act,
          numPersInscritas: (act.numPersInscritas ?? 0) + 1
        });
        this.apuntado.set(true);

        this.messageService.add({
          severity: 'success',
          summary: '¡Enhorabuena!',
          detail: 'Te has unido a la actividad',
        });
      },
      error: (codigo) => {
        console.log('Código de error recibido:', codigo); // Debug
        const mensaje = this.errorService.getMensajeError(codigo);
        this.errorService.showError(mensaje);
      },
    });
  }

  desapuntarse(): void {
    const act = this.actividad();
    if (!act) return;

    this.actService.desapuntarseActividad(this.actividadId).subscribe({
      next: () => {
        const nuevosInscritos = Math.max(Number(act.numPersInscritas ?? 0) - 1, 0);
        this.actividad.set({ ...act, numPersInscritas: nuevosInscritos });

        this.messageService.add({ severity: 'info', summary: 'Vaya...', detail: 'Te has desapuntado de la actividad' });
        this.apuntado.set(false);
      },
      error: (codigo) => {
        const mensaje = this.errorService.getMensajeError(codigo);
        this.errorService.showError(mensaje);
      }
    });
  }

  goEditar(): void {
    this.router.navigate(['/actividades/editar-actividad/', this.actividadId]);
  }

}
