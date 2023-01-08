import { Component, ViewEncapsulation } from '@angular/core';
import { RequestService } from 'src/app/shared/request.service';
import { io, Socket } from "socket.io-client";
import { AuthService } from 'src/app/shared/auth.service';

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
    if (this.authService.isConnected === null) {
      this.authService.isLoggedIn();
    }
    console.log("ngOnInit index", this.authService.isConnected)
    //document.body.appendChild(this.game.renderer.domElement);
    // const that = this;
    // this.socket.on("game_gameId_get", (data) => {
    //   this.getGameId(data);
    // });
  }

  isConnected() {
    return this.authService.isConnected;
  }

  logout() {
    this.authService.doLogout();
  }

}
