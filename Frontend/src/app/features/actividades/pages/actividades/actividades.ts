import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { TabsModule } from 'primeng/tabs';
import { ButtonModule } from 'primeng/button';

import { Header } from '../../../../core/layout/header/header';
import { Footer } from '../../../../core/layout/footer/footer';
import { CardGallery } from '../../components/card-gallery/card-gallery';

@Component({
  selector: 'app-actividades',
  imports: [CardGallery, Header, Footer, ButtonModule, RouterModule, TabsModule],
  templateUrl: './actividades.html',
  styleUrl: './actividades.scss'
})

export class Actividades {

}
