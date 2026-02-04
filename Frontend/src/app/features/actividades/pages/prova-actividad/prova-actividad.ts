import { Component } from '@angular/core';
import { JoinGallery } from '../../components/join-gallery/join-gallery';
import { JoinedCarousel } from '../../components/joined-carousel/joined-carousel';
import { CreatedCarousel } from '../../components/created-carousel/created-carousel';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';
import { TabsModule } from 'primeng/tabs';
import { Header } from '../../../../core/layout/header/header';
import { Footer } from '../../../../core/layout/footer/footer';
import { CardGallery } from '../../components/card-gallery/card-gallery';

@Component({
  selector: 'app-prova-actividad',
  imports: [JoinGallery, Header, Footer, CardGallery, JoinedCarousel, CreatedCarousel, ButtonModule, RouterModule, TabsModule],
  templateUrl: './prova-actividad.html',
  styleUrl: './prova-actividad.scss',
})
export class ProvaActividad {

}
