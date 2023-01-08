import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { io, Socket } from "socket.io-client";
import { SocketService } from './services/socket/socket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent implements OnInit {
  status = 'DOWN';

  constructor(private socketService: SocketService) {
    const socket: Socket = socketService.socket;
    if (socket) {
      socket.on("connect", () => {
        this.status = "UP";
      })
    }
  }

  ngOnInit() { }

}
