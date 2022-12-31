import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { io, Socket } from "socket.io-client";
import { RequestService } from './shared/request.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent implements OnInit {
  status = 'DOWN';

  constructor(private requestService: RequestService) {
    const socket: Socket = requestService.getSocket();
    if (socket) {
      socket.on("connect", () => {
        this.status = "UP";
      })
    }
  }

  ngOnInit() { }

}
