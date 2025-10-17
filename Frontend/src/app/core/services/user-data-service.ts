import { Injectable } from '@angular/core';


@Injectable({ providedIn: 'root' })

export class UserDataService {

  private email: string | null = null;


  setEmail(email: string) {

    this.email = email;

  }

  
  getEmail(): string {
    return (this.email ?? '').trim();
  }

  clearEmail() {

    this.email = null;

  }

}
