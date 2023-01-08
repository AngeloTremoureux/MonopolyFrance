import { Injectable } from '@angular/core';
import { io, Socket } from "socket.io-client";

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  public readonly socket: Socket<any>;
  private readonly apiUri: string = ":8080"

  constructor() {
    const token: string | null = localStorage.getItem('access_token');
    const username: string | null = localStorage.getItem('username');
    this.socket = io(this.apiUri, { query: { token, username }});
  }
}
