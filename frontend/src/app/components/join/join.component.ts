import { Component } from '@angular/core';
import { RequestService } from 'src/app/shared/request.service';

@Component({
  selector: 'app-join',
  templateUrl: './join.component.html',
  styleUrls: ['./join.component.css']
})
export class JoinComponent {
  clicked: boolean = false;
  socket: any;

  constructor(private requestService: RequestService) {
    //this.game = Game.getGame();
    this.socket = requestService.getSocket();
    //this.game.setRequestService(this.requestService);
  }

  joinGameApply(code: string) {
    this.clicked = true;
    this.socket.emit("game_gameId_get", code, (response: any) => {
      console.log(response);
      this.clicked = false;
    });
  }
}
