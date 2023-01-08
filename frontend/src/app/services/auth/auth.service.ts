import { Injectable } from '@angular/core';
import { Socket } from "socket.io-client";
import { SocketService } from '../socket/socket.service';
import { Router } from '@angular/router';

interface PlayerType {
  id: number,
  username: string,
  email: string
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private socket: Socket;
  private isConnected: boolean | null = null;
  private currentUser: PlayerType | undefined;

  constructor(private socketService: SocketService, public router: Router) {
    this.socket = this.socketService.socket;
  }

  public getIsConnected(): boolean | null {
    return this.isConnected;
  }

  public getCurrentUser(): PlayerType | undefined {
    return this.currentUser;
  }

  public getSocket(): Socket<any> {
    return this.socket;
  }

  public getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  public signIn(token: string, username: string) {
    localStorage.setItem('access_token', token);
    localStorage.setItem('username', username);
  }

  public async isLoggedIn(): Promise<boolean> {
    const response: any = await new Promise((resolve) => {
      console.log(this.socket)
      this.socket.emit("socket_is_logged", (response: any) => {
        resolve(response);
      });
    });
    if (response.success === true) {
      this.isConnected = true;
      this.currentUser = {
        email: response.data.email,
        username: response.data.username,
        id: response.data.id,
      }
      return true;
    } else {
      this.isConnected = false;
      this.currentUser = undefined;
      return false;
    }
  }

  public doLogout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('username');
    this.currentUser = undefined;
    this.isConnected = false;
    this.router.navigateByUrl('/refresh', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/']);
    });
  }
}
