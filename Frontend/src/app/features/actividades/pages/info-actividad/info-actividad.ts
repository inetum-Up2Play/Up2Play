import { Component, signal, inject, AfterViewInit, Injector, effect, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';


import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { RatingModule } from 'primeng/rating';
import { InputIconModule } from 'primeng/inputicon';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { MessageModule } from 'primeng/message';
import { ConfirmDialog } from 'primeng/confirmdialog';

import { Actividad } from '../../../../shared/models/Actividad';
import { Usuario } from '../../../../shared/models/usuario.model';
import { Perfil } from '../../../../shared/models/Perfil';
import { ActService } from '../../../../core/services/actividad/act-service';
import { Header } from '../../../../core/layout/header/header';
import { DeporteImgPipe } from '../../pipes/deporte-img-pipe';
import { AvatarPipe } from '../../../../shared/pipes/avatar-pipe';
import { ErrorService } from '../../../../core/services/error/error-service';
import { PerfilService } from '../../../../core/services/perfil/perfil-service';

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
import { Footer } from '../../../../core/layout/footer/footer';
import { Avatar } from 'primeng/avatar';
import { AvatarGroup } from 'primeng/avatargroup';
import { catchError, forkJoin, map, of } from 'rxjs';
import { TooltipModule } from 'primeng/tooltip';
import { PagosService } from '../../../../core/services/pagos/pagos-service';
import { UserService } from '../../../../core/services/user/user-service';

interface ParticipanteView {
  nombre: string;
  avatarId: number;
}

@Component({
  selector: 'app-info-actividad',
  imports: [TooltipModule, Avatar, AvatarGroup, ConfirmDialog, CardModule, DividerModule, RatingModule, InputIconModule, FormsModule, ReactiveFormsModule, ToastModule, MessageModule,
    Header, DeporteImgPipe, AvatarPipe, Footer],
  providers: [ConfirmationService, MessageService],
  templateUrl: './info-actividad.html',
  styleUrls: ['./info-actividad.scss'],
})

export class InfoActividad implements OnInit, AfterViewInit {
  actividad = signal<Actividad | null>(null);
  usuario = signal<Usuario | null>(null);
  perfil = signal<Perfil | null>(null);
  apuntado = signal<boolean>(false);
  isCreador = signal<boolean>(false);
  avatarIdCreador = signal<number>(0);
  avatarIdUsuario = signal<number>(0);
  idsUsuarios: number[] = []; // aquí tendrás tus ids inscritos
  avataresUsuarios = signal<ParticipanteView[]>([]); // { [idUsuario]: avatarId 

  private messageService = inject(MessageService);
  private actService = inject(ActService);
  private errorService = inject(ErrorService);
  private perfilService = inject(PerfilService);
  private pagosService = inject(PagosService);
  private userService = inject(UserService);
  private injector = inject(Injector);
  private router = inject(Router);

  actividadId: number;
  errorUbicacion = signal<string | null>(null);

  act = {
    ubicacion: '',
  };

  constructor(private route: ActivatedRoute, private http: HttpClient, private confirmationService: ConfirmationService) {
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

    effect(() => {
      const act = this.actividad();
      if (act && act.usuarioCreadorId) {
        this.getAvatarCreador(act.usuarioCreadorId);
      }
    }, { injector: this.injector });

    this.cargarInscritos();

    this.actService.usuariosInscritosActividad(this.actividadId).pipe(
      map(participantes =>
        (participantes ?? [])
          .map(p => p?.nombreUsuario)   // <- ajusta aquí
          .filter(nombre => typeof nombre === 'string' && nombre.trim() !== '')
      )
    ).subscribe(nombres => {
      console.log('Nombres de usuario:', nombres);
    });


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
                this.errorUbicacion.set(null); // No hay error
              } else {
                this.errorUbicacion.set(
                  `No se pudo localizar la dirección: ${act.ubicacion}`
                );
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
    this.actService
      .estoyApuntado(this.actividadId)
      .subscribe((flag) => this.apuntado.set(flag));

    // Consultar si el usuario es el creador de la actividad y actualizar el signal
    this.actService
      .comprobarCreador(this.actividadId)
      .subscribe((flag) => this.isCreador.set(flag));


  }

  getAvatarCreador(idCreador: number) {
    this.perfilService.getPerfilByUserId(idCreador).subscribe({
      next: (perfil) => {
        this.avatarIdCreador.set(perfil?.imagenPerfil ?? 0);
      },
      error: (err) => {
        console.error('Error cargando avatar del creador', err);
        this.avatarIdCreador.set(0);
      }
    });
  }

  cargarAvataresMasivos(participantes: { id: number, nombre: string }[]) {
    const peticiones = participantes.map(p =>
      this.perfilService.getPerfilByUserId(p.id).pipe(
        map(perfil => {
          // Construimos el objeto final para la vista
          return {
            nombre: p.nombre,
            avatarId: (perfil as any)?.imagen ?? (perfil as any)?.imagenPerfil ?? 0
          };
        }),
        // Si falla, devolvemos el objeto con avatar 0 pero conservando el nombre
        catchError(() => of({ nombre: p.nombre, avatarId: 0 }))
      )
    );

    forkJoin(peticiones).subscribe(resultado => {
      this.avataresUsuarios.set(resultado);
    });
  }

  cargarInscritos(): void {
    this.actService.usuariosInscritosActividad(this.actividadId).pipe(
      map((participantes: any) =>
        (participantes ?? [])
          .map((p: any) => ({ id: p?.id, nombre: p?.nombreUsuario ?? 'Usuario' }))
          .filter((p: any) => p.id != null)
      )
    ).subscribe({
      next: (participantes: { id: number, nombre: string }[]) => {
        if (participantes.length > 0) {
          this.cargarAvataresMasivos(participantes);
        } else {
          this.avataresUsuarios.set([]);
        }
      },
      error: (err) => console.error('Error cargando participantes', err)
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

    const precioStr = act.precio ? act.precio.toString().replace(',', '.') : '0';
    const precioNumerico = parseFloat(precioStr);
    // LÓGICA POR SI LA ACTIVIDAD ES DE PAGO
    if (!isNaN(precioNumerico) && precioNumerico > 0) {

      if (!act.usuarioCreadorId) {
        this.errorService.showError('No se puede identificar al creador de la actividad');
        return;
      }

      this.userService.getUsuarioPorId(act.usuarioCreadorId).subscribe({
        next: (creador) => {
          // Ya tenemos al usuario creador, verificamos su Stripe ID
          if (creador && creador.stripeAccountId) {

            // Todo correcto: Guardamos y navegamos
            this.pagosService.setActivity({
              actividadId: act.id,
              nombre: act.nombre,
              precio: precioNumerico,
              organizadorStripeId: creador.stripeAccountId,
              deporte: act.deporte,
              fecha: act.fecha,
              ubicacion: act.ubicacion
            });

            this.router.navigate(['/pagos/pago']);

          } else {
            // El creador existe, pero no tiene pagos configurados
            this.messageService.add({
              severity: 'error',
              summary: 'Error de Pago',
              detail: 'El organizador no tiene configurada su cuenta para recibir pagos.'
            });
          }
        },
        error: (err) => {
          console.error(err);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo contactar con el servidor para verificar al organizador.'
          });
        }
      });

      return; // Detenemos aquí para que no siga al flujo gratuito
    }

    // LÓGICA PARA ACTIVIDADES GRATUITAS
    this.actService.unirteActividad(act.id).subscribe({
      next: () => {
        this.apuntado.set(true);
        this.cargarInscritos();

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

        this.messageService.add({
          severity: 'info',
          summary: 'Vaya...',
          detail: 'Te has desapuntado de la actividad',
        });
        this.apuntado.set(false);
        this.cargarInscritos();

      },
      error: (codigo) => {
        const mensaje = this.errorService.getMensajeError(codigo);
        this.errorService.showError(mensaje);
      },
    });
  }

  confirm(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: '¿Seguro que quieres eliminar esta actividad?',
      header: 'Cuidado!',
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
        const act = this.actividad();
        if (!act) return;

        this.actService.deleteActividad(this.actividadId).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Oh... :(', detail: 'Actividad eliminada correctamente' });
            setTimeout(() => {
              this.actService['router'].navigate(['/actividades']);
            }, 2500); // espera 1.5 segundos para que se vea el toast
          },
          error: (codigo) => {
            const mensaje = this.errorService.getMensajeError(codigo);
            this.errorService.showError(mensaje);
          }
        })
      },
      reject: () => {
        this.messageService.add({ severity: 'warn', summary: 'Rechazado', detail: 'Has cancelado la eliminación' });
      },
    });
  }

  goEditar(): void {
    this.router.navigate(['/actividades/editar-actividad/', this.actividadId]);
  }
}
