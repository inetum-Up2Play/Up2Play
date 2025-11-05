import { Component } from '@angular/core';
import { AuthHeaderComponent } from '../../components/auth-header.component/auth-header.component';
import { AuthFooterComponent } from '../../components/auth-footer.component/auth-footer.component';
import { MailFormComponent } from "../../components/mail-form.component/mail-form.component";

@Component({
  selector: 'app-mail-recover',
  imports: [AuthHeaderComponent, AuthFooterComponent, MailFormComponent],
  templateUrl: './mail-recover.html',
  styleUrl: './mail-recover.scss'
})

export class MailRecover {
}
