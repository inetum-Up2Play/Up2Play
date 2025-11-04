import { Component } from '@angular/core';
import { AuthHeaderComponent } from '../../components/auth-header.component/auth-header.component';
import { AuthFooterComponent } from '../../components/auth-footer.component/auth-footer.component';
import { NewPasswordForm } from '../../components/new-password-form/new-password-form';

@Component({
  selector: 'app-new-password',
  imports: [AuthFooterComponent, AuthHeaderComponent, NewPasswordForm],
  templateUrl: './new-password.html',
  styleUrl: './new-password.scss'
})

export class NewPassword {

}

