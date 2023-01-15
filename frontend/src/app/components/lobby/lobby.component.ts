import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GameManagerService } from 'src/app/services/gameManager/game-manager.service';
import { SocketService } from 'src/app/services/socket/socket.service';
import { Socket } from "socket.io-client";
import { Clipboard } from '@angular/cdk/clipboard';

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
  public copyMessage: string;
  public inCopy: boolean = false;

  private socket: Socket;

  constructor(
    private gameManagerService: GameManagerService,
    private router: Router,
    private socketService: SocketService,
    public clipboard: Clipboard,
  ) {
    this.board = this.gameManagerService.board;
    this.boards = this.gameManagerService.boards;
    this.game = this.gameManagerService.game;
    this.copyMessage = "Copier le code (" + this.game.code + ")";

    if (!this.board) {
      this.router.navigateByUrl("/");
    }
    this.socket = socketService.socket;
    this.socket.on("newPlayer", (board) => {
      console.log(board);
      this.boards.push(board.Board);
    });

    this.socket.on("removePlayer", (playerId) => {
      if (playerId === this.board.PlayerId) this.router.navigateByUrl("/");
      const index = this.boards.findIndex((x: any) => x.PlayerId === playerId);
      if (index > -1) {
        this.boards.splice(index, 1);
      }
    });

    this.socket.on("update_lobby_state", (data) => {
      if (data.PlayerId === this.board.PlayerId) this.loading = false;
      this.boards.find((x: any) => x.PlayerId === data.PlayerId).isReady = data.isReady;
    });

    this.socket.on("startGame", () => {
      alert("started");
      this.game.isStarted = true;
    });
  }

  kick(index: number) {
    const board = this.boards[index];
    if (!board && board.PlayerId !== this.board.PlayerId) return;
    const valeur = confirm("Êtes vous sûr de vouloir expulser du salon " + board.Player.username + " ?");
    if (valeur) {
      this.socket.emit("kick_lobby", board.Player.id);
    }
  }

  async copy() {
    if (this.inCopy) return;
    this.inCopy = true;
    const success = this.clipboard.copy(this.game.code);
    const defaultCopy = "Copier le code (" + this.game.code + ")";
    if (success) {
      this.copyMessage = "📂 ... Copié ! ";
    }
    setTimeout(async () => {
      this.copyMessage = "_";
      let index = 20;
      let i = 0;
      for (const letter of defaultCopy.split("")) {
        this.copyMessage = this.copyMessage.substring(0, this.copyMessage.length-1);
        this.copyMessage += letter + "_";
        if (i > defaultCopy.length - 5) {
          index += 100;
        }
        if (i >= defaultCopy.length - 1) {
          this.copyMessage = this.copyMessage.substring(0, this.copyMessage.length-1);
          this.inCopy = false;
        }
        await this.sleep(index);
        i++;
      }
    }, 1000);
  }

  isPlayer(index: number): boolean {
    return this.boards[index] ? true : false;
  }

  ngOnInit(): void {

  }

  leave() {
    this.socket.emit("leave_lobby", (response: any) => {
      if (response.success) {
        this.router.navigateByUrl("/");
      }
    });
  }

  start() {
    if (!this.readyToStart()) return;
    this.socket.emit("start_game");
  }

  readyToStart() {
    return this.boards.length > 1 && this.boards.filter((x: any) => x.isReady === false).length === 0;
  }

  changeReadyState(event: Event) {
    if (this.loading) return;
    this.loading = true;
    const state = (event.target as any);
    if (!state) return;
    const status = state.classList && state.classList.contains('btn-danger') ? true : false;
    this.socket.emit("set_lobby_state", status);
  }

  sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

}
