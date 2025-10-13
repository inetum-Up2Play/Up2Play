import { Component } from '@angular/core';
import { LoginFormComponent } from '../../components/login-form.component/login-form.component';
import { AuthFooterComponent } from '../../components/auth-footer.component/auth-footer.component';
import { AuthHeaderComponent } from '../../components/auth-header.component/auth-header.component';

@Component({
  selector: 'app-login',
  imports: [LoginFormComponent, AuthFooterComponent, AuthHeaderComponent],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})

export class Login {

}
