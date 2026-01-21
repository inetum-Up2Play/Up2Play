import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { JoinGallery } from '../../components/join-gallery/join-gallery';
import { Header } from '../../../../core/layout/header/header';
import { JoinedCarousel } from '../../components/joined-carousel/joined-carousel';
import { CreatedCarousel } from "../../components/created-carousel/created-carousel";
import { Footer } from '../../../../core/layout/footer/footer';

import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-actividades',
  imports: [JoinGallery, Header, Footer,  JoinedCarousel, CreatedCarousel, ButtonModule, RouterModule],
  templateUrl: './actividades.html',
  styleUrl: './actividades.scss'
})

export class Actividades {

}
