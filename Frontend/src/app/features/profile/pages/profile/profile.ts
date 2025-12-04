import { Component } from '@angular/core';
import { Header } from '../../../../core/layout/header/header';
import { FormProfile } from '../../components/form-profile/form-profile';
import { AvatarProfile } from '../../components/avatar-profile/avatar-profile';

@Component({
  selector: 'app-profile',
  imports: [Header, FormProfile, AvatarProfile],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class Profile {

}
