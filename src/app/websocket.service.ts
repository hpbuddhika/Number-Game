import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';


@Injectable({
  providedIn: 'root'
})
export class WebsocketService{

  private myWebSocket: WebSocketSubject<any>;

  constructor() {
    this.myWebSocket = webSocket('ws://localhost:8089/subscribe');
  }

  connect(): Observable<any>{
    return this.myWebSocket.asObservable();
  }

}
