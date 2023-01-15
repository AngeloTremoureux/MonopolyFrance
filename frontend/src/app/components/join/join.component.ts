import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SocketService } from 'src/app/services/socket/socket.service';

@Component({
  selector: 'app-join',
  templateUrl: './join.component.html',
  styleUrls: ['./join.component.css']
})
export class JoinComponent {
  clicked: boolean = false;
  socket: any;

  constructor(private socketService: SocketService, private router: Router) {
    this.socket = this.socketService.socket;
  }

  joinGameApply(code: string) {
    this.clicked = true;
    this.socket.emit("join_game", code, (response: any) => {
      if (response) this.router.navigateByUrl("/lobby")
      this.clicked = false;
    });
  }
}
