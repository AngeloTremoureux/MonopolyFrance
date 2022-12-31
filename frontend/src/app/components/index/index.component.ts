import { Component, ViewEncapsulation } from '@angular/core';
import { RequestService } from 'src/app/shared/request.service';
import { io, Socket } from "socket.io-client";

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class IndexComponent {

  router: string;
  clicked: boolean = false;
  socket: Socket;

  constructor(private requestService: RequestService) {
    //this.game = Game.getGame();
    this.router = 'index';
    this.socket = requestService.getSocket();
    console.log("constructed ")
    this.socket.on("game_gameId_get", (data) => {
      this.getGameId(data);
    })
    //this.game.setRequestService(this.requestService);
  }

  ngOnInit() {
    //document.body.appendChild(this.game.renderer.domElement);
    // const that = this;
    // this.socket.on("game_gameId_get", (data) => {
    //   this.getGameId(data);
    // });
  }

  getGameId(data: any) {
    console.log(data);
    this.clicked = false;
  }

  joinGame() {
    this.router = 'join';
  }

  createGame() {
    this.router = 'create';
  }

  joinGameApply(code: string) {
    this.clicked = true;
    this.socket.emit("game_gameId_get", code);
  }

}
