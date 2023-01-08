import { Component } from '@angular/core';
import { SocketService } from 'src/app/services/socket/socket.service';

@Component({
  selector: 'app-join',
  templateUrl: './join.component.html',
  styleUrls: ['./join.component.css']
})
export class JoinComponent {
  clicked: boolean = false;
  socket: any;

  constructor(private socketService: SocketService) {
    this.socket = this.socketService.socket;
  }

  joinGameApply(code: string) {
    this.clicked = true;
    this.socket.emit("game_gameId_get", code, (response: any) => {
      console.log(response);
      this.clicked = false;
    });
  }
}
