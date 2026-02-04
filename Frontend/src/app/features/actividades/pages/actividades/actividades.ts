import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { JoinGallery } from '../../components/join-gallery/join-gallery';
import { Header } from '../../../../core/layout/header/header';
import { JoinedCarousel } from '../../components/joined-carousel/joined-carousel';
import { CreatedCarousel } from "../../components/created-carousel/created-carousel";
import { Footer } from '../../../../core/layout/footer/footer';
import { TabsModule } from 'primeng/tabs';
import { ButtonModule } from 'primeng/button';
import { CardGallery } from '../../components/card-gallery/card-gallery';

@Component({
  selector: 'app-actividades',
  imports: [JoinGallery, CardGallery, Header, Footer,  JoinedCarousel, CreatedCarousel, ButtonModule, RouterModule, TabsModule],
  templateUrl: './actividades.html',
  styleUrl: './actividades.scss'
})

export class Actividades {

}
