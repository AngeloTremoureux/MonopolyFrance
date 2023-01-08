import { Injectable } from '@angular/core';
import { SocketService } from '../socket/socket.service';

@Injectable({
  providedIn: 'root'
})
export class GameManagerService {

  constructor(private socketService: SocketService) {}

  createGame() {
    const socket = this.socketService.socket;
    socket.emit("create_game", (data: any) => {
      console.log(data);
    });
  }
}
