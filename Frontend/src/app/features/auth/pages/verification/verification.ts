import { Component } from '@angular/core';

import { VerificationFormComponent } from '../../components/verification-form.component/verification-form.component';
import { AuthFooterComponent } from '../../components/auth-footer.component/auth-footer.component';
import { AuthHeaderComponent } from '../../components/auth-header.component/auth-header.component';

@Component({
  selector: 'app-verification',
  imports: [VerificationFormComponent, AuthFooterComponent, AuthHeaderComponent],
  templateUrl: './verification.html',
  styleUrl: './verification.scss'
})

export class Verification {

}



