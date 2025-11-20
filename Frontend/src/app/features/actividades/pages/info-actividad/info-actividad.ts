import { Component, signal, inject, AfterViewInit } from '@angular/core';

import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { RatingModule } from 'primeng/rating';
import { InputIconModule } from 'primeng/inputicon';
import { MessageService } from 'primeng/api';

import { Actividad } from '../../../../core/models/Actividad';
import { ActService } from '../../../../core/services/actividad/act-service';
import { Header } from '../../../../core/layout/header/header';
import { ErrorService } from '../../../../core/services/error/error-service';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { MessageModule } from 'primeng/message';


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
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-info-actividad',
  imports: [
    CardModule,
    DividerModule,
    RatingModule,
    InputIconModule,
    FormsModule,
    ReactiveFormsModule,
    Header,
    ToastModule,
    MessageModule,
  ],
  templateUrl: './info-actividad.html',
  styleUrls: ['./info-actividad.scss'],
})
export class InfoActividad implements AfterViewInit {
  actividad = signal<Actividad | null>(null);

  private messageService = inject(MessageService);
  private actService = inject(ActService);
  private errorService = inject(ErrorService);

  actividadId: number;

  act = {
    ubicacion: '',
  };

  constructor(private route: ActivatedRoute, private http: HttpClient) {
    this.actividadId = Number(route.snapshot.paramMap.get('id'));
    // Simulación: obtener actividad por ID

    //this.actService.infoActividad(this.actividadId).subscribe(act => {
    // this.actividad.set(act); // Actualizamos la signal con la respuesta
    // this.formRating.get('rating')?.setValue(this.getNivelValue(act.nivel)); //Actualizamos el rating según su nivel
    // });
  }

  ngAfterViewInit(): void {
    this.http
      .get<any>(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          this.act.ubicacion
        )}`
      )
      .subscribe((results) => {
        console.log('Resultados Nominatim:', results); // Debug
        if (results.length > 0) {
          const lat = parseFloat(results[0].lat);
          const lon = parseFloat(results[0].lon);
          this.initMap(lat, lon);
        } else {
          console.error('No se encontró la ubicación');
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
  zoomOutTipLabel: 'Alejar'
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
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(act.ubicacion)}`
          )
          .subscribe((results) => {
            if (results.length > 0) {
              const lat = parseFloat(results[0].lat);
              const lon = parseFloat(results[0].lon);
              this.initMap(lat, lon);
            } else {
              console.error('No se encontró la ubicación');
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
  // Imagen por deporte
  /*   getImagenPorDeporte(deporte?: string): string {
      const map: Record<string, string> = {
        'Fútbol': 'assets/img/futbol.jpg',
        'Tenis': 'assets/img/tenis.jpg',
        'Basket': 'assets/img/basket.jpg'
      };
      return deporte ? (map[deporte] || 'assets/img/default.jpg') : 'assets/img/default.jpg';
    } */

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

  // Creo que aquí debería ir la lógica para según el deporte que sea,
  // darle un valor al actividad.imagen distinto y así se muestre luego
  // switch (this.actividad.deporte) {
  // }
}
