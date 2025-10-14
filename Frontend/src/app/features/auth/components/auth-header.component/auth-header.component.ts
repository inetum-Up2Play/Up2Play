import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-auth-header',
  imports: [RouterModule],
  templateUrl: './auth-header.component.html',
  styleUrl: './auth-header.component.scss'
})
export class AuthHeaderComponent {
  landingUrl = 'http://127.0.0.1:5500/Up2Play/Landing/index.html';
}
