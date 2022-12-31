import { Component, OnInit } from '@angular/core';
import { io, Socket } from "socket.io-client";
import { StatusService } from './shared/status.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'node-express-angular';
  status = 'DOWN';
  socket: Socket;

  constructor(private statusService: StatusService) {
    this.socket = io(":8080");
  }

  ngOnInit() {
    this.statusService
      .getStatus()
      .then((result: any) => {
        this.status = result.status;
      });
  }

}
