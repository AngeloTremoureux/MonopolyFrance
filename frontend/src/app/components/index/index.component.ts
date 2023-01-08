import { Component, ViewEncapsulation } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: [
    './index.component.css',
    './../../app.component.css'
  ],
  encapsulation: ViewEncapsulation.None,
})
export class IndexComponent {

  constructor(public authService: AuthService) {}

  ngOnInit() {
    if (this.authService.getIsConnected() === null) this.authService.isLoggedIn();
    console.log("ngOnInit index", this.authService.getIsConnected());
  }

  isConnected() {
    return this.authService.getIsConnected();
  }

  logout() {
    this.authService.doLogout();
  }

  getUser() {
    return this.authService.getCurrentUser();
  }

}
