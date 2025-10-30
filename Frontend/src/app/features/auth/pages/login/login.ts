import { Component, inject } from '@angular/core';
import { LoginFormComponent } from '../../components/login-form.component/login-form.component';
import { AuthFooterComponent } from '../../components/auth-footer.component/auth-footer.component';
import { AuthHeaderComponent } from '../../components/auth-header.component/auth-header.component';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth-service';
import { UserDataService } from '../../../../core/services/user-data-service';

@Component({
  selector: 'app-login',
  imports: [LoginFormComponent, AuthFooterComponent, AuthHeaderComponent],
  providers: [MessageService],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})

export class Login {

  private authService = inject(AuthService);
  private userDataService = inject(UserDataService);
  private router = inject(Router);
  private message = inject(MessageService);


}
