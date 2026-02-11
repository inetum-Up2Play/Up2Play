import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { Home } from './home';
import { UserService } from '../../core/services/user/user-service';
import { ActService } from '../../core/services/actividad/act-service';
import { PerfilService } from '../../core/services/perfil/perfil-service';
import { MessageService } from 'primeng/api';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { signal } from '@angular/core';

describe('Home', () => {
  let component: Home;
  let fixture: ComponentFixture<Home>;

  const userServiceMock = {
    getUsuario: () =>
      of({
        nombreUsuario: 'TestUser',
        email: 'test@demo.com',
        avatar: 'avatar.png',
      }),
  };

  const actServiceMock = {
    listarActividadesApuntadas: () => of([]),
    listarActividadesCreadas: () => of([]),
    listarActividadesNoApuntadas: () => of([]),
  };

  const perfilServiceMock = {
    getPerfil: () => of({}),
    avatarGlobal: signal('assets/img/avatar.png'),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Home],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        MessageService,
        provideNoopAnimations(),
        provideRouter([]),
        { provide: UserService, useValue: userServiceMock },
        { provide: ActService, useValue: actServiceMock },
        { provide: PerfilService, useValue: perfilServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Home);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
