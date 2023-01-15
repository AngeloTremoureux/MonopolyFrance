import { Injectable } from '@angular/core';
import { SocketService } from '../socket/socket.service';

@Injectable({
  providedIn: 'root'
})
export class GameManagerService {

  public board: any;
  public boards: any;
  public game: any;

  constructor(private socketService: SocketService) {}

  public createGame(callback: Function) {
    const socket = this.socketService.socket;
    socket.emit("create_game", (data: any) => {
      if (data && data.success && data.data.game) {
        callback(data.data.game);
      } else {
        callback(null);
      }
    });
  }
}
