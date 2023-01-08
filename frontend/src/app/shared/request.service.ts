import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { io, Socket } from "socket.io-client";
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})

export class RequestService {

  private socket: Socket;
  private api = 'localhost:8080/api/';

  constructor(private http: HttpClient) {
    const token = localStorage.getItem('access_token');
    const username = localStorage.getItem('username');
    this.socket = io(":8080", { query: { token, username }});
  }

  public getSocket() {
    return this.socket;
  }

  getData(url: string): Promise<void | any> {
    return this.http.get(this.api + url)
      .toPromise()
      .then(response => response)
      .catch(this.error);
  }

  // Error handling
  private error (error: any) {
    let message = (error.message) ? error.message :
    error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(message);
  }
}
