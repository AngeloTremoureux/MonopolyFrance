import { Component, ViewEncapsulation } from '@angular/core';
import { RequestService } from 'src/app/shared/request.service';
import { io, Socket } from "socket.io-client";

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: [
    './index.component.css',
    './../app.component.css'
  ],
  encapsulation: ViewEncapsulation.None,
})
export class IndexComponent {

  ngOnInit() {
    //document.body.appendChild(this.game.renderer.domElement);
    // const that = this;
    // this.socket.on("game_gameId_get", (data) => {
    //   this.getGameId(data);
    // });
  }

}
