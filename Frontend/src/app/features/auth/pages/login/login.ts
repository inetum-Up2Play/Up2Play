import { Component } from '@angular/core';
import { AuthHeaderComponent } from '../../components/auth-header.component/auth-header.component';
import { AuthFooterComponent } from '../../components/auth-footer.component/auth-footer.component';

@Component({
  selector: 'app-login',
  imports: [
    AuthHeaderComponent,
    AuthFooterComponent
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {

}
