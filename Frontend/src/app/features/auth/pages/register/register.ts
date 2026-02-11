import { Component } from '@angular/core';

import { RegisterFormComponent } from '../../components/register-form.component/register-form.component';
import { AuthFooterComponent } from '../../components/auth-footer.component/auth-footer.component';
import { AuthHeaderComponent } from '../../components/auth-header.component/auth-header.component';

@Component({
  selector: 'app-register',
  imports: [RegisterFormComponent, AuthFooterComponent, AuthHeaderComponent],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class Register {

}
