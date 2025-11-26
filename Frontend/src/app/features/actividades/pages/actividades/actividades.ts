import { Component } from '@angular/core';
import { JoinGallery } from '../../components/join-gallery/join-gallery';
import { Header } from '../../../../core/layout/header/header';
import { JoinedCarousel } from '../../components/joined-carousel/joined-carousel';
import { CreatedCarousel } from "../../components/created-carousel/created-carousel";
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-actividades',
  imports: [JoinGallery, Header, JoinedCarousel, CreatedCarousel, ButtonModule, RouterModule],
  templateUrl: './actividades.html',
  styleUrl: './actividades.scss'
})
export class Actividades {

}
