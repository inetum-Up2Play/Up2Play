import { Component } from '@angular/core';

import { VerificationPasswordForm } from '../../components/verification-password-form/verification-password-form';
import { AuthFooterComponent } from '../../components/auth-footer.component/auth-footer.component';
import { AuthHeaderComponent } from '../../components/auth-header.component/auth-header.component';

@Component({
  selector: 'app-verification-password',
  imports: [VerificationPasswordForm, AuthFooterComponent, AuthHeaderComponent],
  templateUrl: './verification-password.html',
  styleUrl: './verification-password.scss'
})

export class VerificationPassword {
  
}
