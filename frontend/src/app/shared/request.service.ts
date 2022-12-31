import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class RequestService {
  private statusUrl = '/api/';

  constructor(private http: HttpClient) { }

  // Get the status
  getData(url: string): Promise<void | any> {
    return this.http.get(this.statusUrl + url)
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
