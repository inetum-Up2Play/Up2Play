import { Component } from '@angular/core';
import { JoinGallery } from '../../components/join-gallery/join-gallery';
import { Header } from '../../../../core/layout/header/header';

@Component({
  selector: 'app-actividades',
  imports: [JoinGallery, Header],
  templateUrl: './actividades.html',
  styleUrl: './actividades.scss'
})
export class Actividades {

}
