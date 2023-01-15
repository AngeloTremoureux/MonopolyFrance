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
  public loading: boolean = false;

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

    this.socket.on("update_lobby_state", (data) => {
      if (data.PlayerId === this.board.PlayerId) this.loading = false;
      this.boards.find((x: any) => x.PlayerId === data.PlayerId).isReady = data.isReady;
    });
  }

  isPlayer(index: number): boolean {
    return this.boards[index] ? true : false;
  }

  ngOnInit(): void {

  }

  changeReadyState(event: Event) {
    if (this.loading) return;
    this.loading = true;
    const state = (event.target as any);
    if (!state) return;
    const status = state.classList && state.classList.contains('btn-danger') ? true : false;
    this.socket.emit("set_lobby_state", status);
  }
}
