import { AfterViewInit, Component, effect, inject, Injector, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, forkJoin, map, of } from 'rxjs';

// --- PrimeNG ---
import { ConfirmationService, MessageService } from 'primeng/api';
import { Avatar } from 'primeng/avatar';
import { AvatarGroup } from 'primeng/avatargroup';
import { CardModule } from 'primeng/card';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { DividerModule } from 'primeng/divider';
import { InputIconModule } from 'primeng/inputicon';
import { MessageModule } from 'primeng/message';
import { RatingModule } from 'primeng/rating';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';

// --- OpenLayers ---
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import Map from 'ol/Map';
import View from 'ol/View';
import { Zoom } from 'ol/control';
import { fromLonLat } from 'ol/proj';
import OSM from 'ol/source/OSM';
import VectorSource from 'ol/source/Vector';
import { Icon, Style } from 'ol/style';

// --- Servicios y Modelos Propios ---
import { Header } from '../../../../core/layout/header/header';
import { Footer } from '../../../../core/layout/footer/footer';
import { ActService } from '../../../../core/services/actividad/act-service';
import { Actividad } from '../../../../shared/models/Actividad';
import { ErrorService } from '../../../../core/services/error/error-service';
import { PagosService } from '../../../../core/services/pagos/pagos-service';
import { PerfilService } from '../../../../core/services/perfil/perfil-service';
import { UserService } from '../../../../core/services/user/user-service';
import { Perfil } from '../../../../shared/models/Perfil';
import { Usuario } from '../../../../shared/models/usuario.model';
import { AvatarPipe } from '../../../../shared/pipes/avatar-pipe';
import { DeporteImgPipe } from '../../pipes/deporte-img-pipe';

interface ParticipanteView {
  nombre: string;
  avatarId: number;
}

@Component({
  selector: 'app-info-actividad',
  imports: [
    TooltipModule,
    Avatar,
    AvatarGroup,
    ConfirmDialog,
    CardModule,
    DividerModule,
    RatingModule,
    InputIconModule,
    FormsModule,
    ReactiveFormsModule,
    ToastModule,
    MessageModule,
    Header,
    DeporteImgPipe,
    AvatarPipe,
    Footer,
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './info-actividad.html',
  styleUrls: ['./info-actividad.scss'],
})

export class InfoActividad implements OnInit, AfterViewInit {
  // =============================================================
  // INYECCIÓN DE DEPENDENCIAS
  // =============================================================
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private http = inject(HttpClient);
  private injector = inject(Injector);

  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
  private actService = inject(ActService);
  private errorService = inject(ErrorService);
  private perfilService = inject(PerfilService);
  private pagosService = inject(PagosService);
  private userService = inject(UserService);

  // =============================================================
  // ESTADO (SIGNALS & PROPIEDADES)
  // =============================================================
  // Datos principales
  actividad = signal<Actividad | null>(null);
  usuario = signal<Usuario | null>(null);
  perfil = signal<Perfil | null>(null);
  apuntado = signal<boolean>(false);

  // UI & Participantes
  isCreador = signal<boolean>(false);
  avatarIdCreador = signal<number>(0);
  avataresUsuarios = signal<ParticipanteView[]>([]);
  errorUbicacion = signal<string | null>(null);

  // Propiedades locales
  actividadId: number;
  act = { ubicacion: '' };
  idsUsuarios: number[] = [];

  // Formularios
  formRating = new FormGroup({
    rating: new FormControl(0),
  });

  constructor() {
    this.actividadId = Number(this.route.snapshot.paramMap.get('id'));
  }

  // =============================================================
  // CICLO DE VIDA
  // =============================================================

  ngOnInit(): void {
    if (!this.actividadId || Number.isNaN(this.actividadId)) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atención',
        detail: 'ID de actividad inválido',
      });
      return;
    }

    // Efecto para cargar el avatar del creador cuando llegue la actividad
    effect(
      () => {
        const act = this.actividad();
        if (act && act.usuarioCreadorId) {
          this.getAvatarCreador(act.usuarioCreadorId);
        }
      },
      { injector: this.injector }
    );

    // Carga inicial
    this.cargarDatosActividad();
    this.cargarInscritos();
    this.comprobarEstadoUsuario();
  }

  ngAfterViewInit(): void {
    // El mapa se inicializa bajo demanda al recibir coordenadas
  }

  // =============================================================
  // CARGA DE DATOS
  // =============================================================

  cargarDatosActividad(): void {
    this.actService.getActividad(this.actividadId).subscribe({
      next: (act) => {
        this.actividad.set(act);
        this.act.ubicacion = act.ubicacion;

        // Actualizar UI
        this.formRating.get('rating')?.setValue(this.getNivelValue(act.nivel));

        // Iniciar mapa
        if (act.ubicacion) {
          this.resolverCoordenadas(act.ubicacion);
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

  comprobarEstadoUsuario(): void {
    this.actService
      .estoyApuntado(this.actividadId)
      .subscribe((flag) => this.apuntado.set(flag));

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
      },
    });
  }

  cargarInscritos(): void {
    this.actService
      .usuariosInscritosActividad(this.actividadId)
      .pipe(
        map((participantes: any) =>
          (participantes ?? [])
            .map((p: any) => ({
              id: p?.id,
              nombre: p?.nombreUsuario ?? 'Usuario',
            }))
            .filter((p: any) => p.id != null)
        )
      )
      .subscribe({
        next: (participantes: { id: number; nombre: string }[]) => {
          if (participantes.length > 0) {
            this.cargarAvataresMasivos(participantes);
          } else {
            this.avataresUsuarios.set([]);
          }
        },
        error: (err) => console.error('Error cargando participantes', err),
      });
  }

  cargarAvataresMasivos(participantes: { id: number; nombre: string }[]) {
    const peticiones = participantes.map((p) =>
      this.perfilService.getPerfilByUserId(p.id).pipe(
        map((perfil) => {
          return {
            nombre: p.nombre,
            avatarId:
              (perfil as any)?.imagen ?? (perfil as any)?.imagenPerfil ?? 0,
          };
        }),
        catchError(() => of({ nombre: p.nombre, avatarId: 0 }))
      )
    );

    forkJoin(peticiones).subscribe((resultado) => {
      this.avataresUsuarios.set(resultado);
    });
  }

  // =============================================================
  // ACCIONES DE USUARIO (Botones)
  // =============================================================

  apuntarse(): void {
    const act = this.actividad();
    if (!act?.id) {
      this.mostrarAdvertencia('Actividad no cargada');
      return;
    }

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
      error: (codigo) => this.manejarError(codigo),
    });
  }

  pagar(): void {
    const act = this.actividad();
    if (!act?.id) {
      this.mostrarAdvertencia('Actividad no cargada');
      return;
    }

    this.userService.getUsuarioPorId(act.usuarioCreadorId).subscribe({
      next: (creador) => {
        if (creador && creador.stripeAccountId) {
          this.pagosService.setActivity({
            actividadId: act.id!,
            nombre: act.nombre,
            precio: act.precio,
            organizadorStripeId: creador.stripeAccountId,
            deporte: act.deporte,
            fecha: act.fecha,
            ubicacion: act.ubicacion,
          });
          this.router.navigate(['/pagos/pago']);
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error de Pago',
            detail:
              'El organizador no tiene configurada su cuenta para recibir pagos.',
          });
        }
      },
      error: (err) => {
        console.error(err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al verificar organizador.',
        });
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
          detail: 'Te has desapuntado',
        });
        this.apuntado.set(false);
        this.cargarInscritos();
      },
      error: (codigo) => this.manejarError(codigo),
    });
  }

  eliminar(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
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
        this.actService.deleteActividad(this.actividadId).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Actividad eliminada',
              detail: 'Actividad eliminada correctamente',
            });
            setTimeout(() => {
              this.router.navigate(['/actividades']);
            }, 2500);
          },
          error: (codigo) => this.manejarError(codigo),
        });
      },
      reject: () => {
        this.messageService.add({
          severity: 'warn',
          summary: 'Rechazado',
          detail: 'Has cancelado la eliminación',
        });
      },
    });
  }

  goEditar(): void {
    this.router.navigate([
      '/actividades/editar-actividad/',
      this.actividadId,
    ]);
  }

  reembolsoATodos() {}

  // =============================================================
  // LÓGICA DEL MAPA (OpenLayers)
  // =============================================================

  resolverCoordenadas(direccion: string): void {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      direccion
    )}`;
    this.http.get<any>(url).subscribe((results) => {
      if (results.length > 0) {
        const lat = parseFloat(results[0].lat);
        const lon = parseFloat(results[0].lon);
        this.initMap(lat, lon);
        this.errorUbicacion.set(null);
      } else {
        this.errorUbicacion.set(
          `No se pudo localizar la dirección: ${direccion}`
        );
      }
    });
  }

  initMap(lat: number, lon: number): void {
    // Si necesitas limpiar el mapa anterior, hazlo aquí:
    // document.getElementById('map')!.innerHTML = '';

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
      source: new VectorSource({ features: [marker] }),
    });

    const zoomControl = new Zoom({
      className: 'custom-zoom',
      zoomInTipLabel: 'Acercar',
      zoomOutTipLabel: 'Alejar',
    });

    new Map({
      target: 'map',
      layers: [
        new TileLayer({
          source: new OSM({ attributions: 'Mapa por Up2Play' }),
        }),
        vectorLayer,
      ],
      view: new View({
        center: fromLonLat([lon, lat]),
        zoom: 17,
      }),
      controls: [zoomControl],
    });
  }

  // =============================================================
  // HELPERS / UTILS
  // =============================================================

  getNivelValue(nivel: string): number {
    const map: Record<string, number> = {
      INICIADO: 1,
      PRINCIPIANTE: 2,
      INTERMEDIO: 3,
      AVANZADO: 4,
      EXPERTO: 5,
    };
    return map[nivel] || 0;
  }

  extraerHora(fecha: string): string {
    if (!fecha) return '';
    return fecha.includes('T') ? fecha.split('T')[1].substring(0, 5) : '';
  }

  extraerFecha(fecha: string): string {
    if (!fecha) return '';
    return fecha.includes('T') ? fecha.split('T')[0] : '';
  }

  private mostrarAdvertencia(msg: string) {
    this.messageService.add({
      severity: 'warn',
      summary: 'Atención',
      detail: msg,
    });
  }

  private manejarError(codigo: number) {
    const mensaje = this.errorService.getMensajeError(codigo);
    this.errorService.showError(mensaje);
  }

  noReembolso(fechaStr: string): boolean {
    const fechaActividad = new Date(fechaStr).getTime();
    const ahora = Date.now();
    
    // Calculamos 24h en milisegundos: 24h * 60min * 60seg * 1000ms
    const unDiaEnMs = 24 * 60 * 60 * 1000; 
    
    const diferencia = fechaActividad - ahora;

    return diferencia <= unDiaEnMs;
  }
}