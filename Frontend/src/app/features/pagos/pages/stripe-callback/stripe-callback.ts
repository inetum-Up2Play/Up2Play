import { Component } from '@angular/core';
import { Header } from '../../../../core/layout/header/header';
import { Footer } from '../../../../core/layout/footer/footer';

@Component({
  selector: 'app-stripe-callback',
  imports: [Header,Footer],
  templateUrl: './stripe-callback.html',
  styleUrl: './stripe-callback.scss',
})
export class StripeCallback {

}
