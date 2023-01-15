import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GameManagerService } from 'src/app/services/gameManager/game-manager.service';
import { SocketService } from 'src/app/services/socket/socket.service';
import { Socket } from "socket.io-client";

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css']
})
export class LobbyComponent implements OnInit{

  public board: any;
  public game: any;
  public boards: any;

  private socket: Socket;

  constructor(
    private gameManagerService: GameManagerService,
    private router: Router,
    private socketService: SocketService
  ) {
    this.board = this.gameManagerService.board;
    this.boards = this.gameManagerService.boards;
    this.game = this.gameManagerService.game;

    if (!this.board) {
      this.router.navigateByUrl("/");
    }
    this.socket = socketService.socket;
    this.socket.on("newPlayer", (player) => {
      console.log(player);
    });

    this.socket.on("removePlayer", (player) => {
      console.log(player);
    });
  }

  ngOnInit(): void {

  }
}
