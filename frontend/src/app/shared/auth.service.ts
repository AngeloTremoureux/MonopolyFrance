import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { io, Socket } from "socket.io-client";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Router } from '@angular/router';
import { RequestService } from './request.service';

interface PlayerType {
  id: number,
  username: string,
  email: string
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  headers = new HttpHeaders().set('Content-Type', 'application/json');
  socket: Socket;
  isConnected: boolean|null = null;
  currentUser: PlayerType|undefined;
  constructor(private http: HttpClient, public router: Router, public requestService: RequestService) {
    this.socket = this.requestService.getSocket();
  }
  // Sign-in
  signIn(token: string, username: string) {
    localStorage.setItem('access_token', token);
    localStorage.setItem('username', username);
  }
  getToken() {
    return localStorage.getItem('access_token');
  }
  async isLoggedIn(): Promise<boolean> {
    const key = localStorage.getItem('access_token');
    const username = localStorage.getItem('username');
    const response: any = await new Promise((resolve) => {
      console.log(this.socket)
      this.socket.emit("socket_is_logged", (response: any) => {
        resolve(response);
      });
    });
    console.log("is login?" , response);
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
  doLogout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('username');
    this.currentUser = undefined;
    this.isConnected = false;
    this.router.navigateByUrl('/refresh', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/']);
    });
  }
  // Error
  handleError(error: HttpErrorResponse) {
    let msg = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      msg = error.error.message;
    } else {
      // server-side error
      msg = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(msg);
  }
}
