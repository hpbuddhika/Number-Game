import { Injectable, OnInit } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';


@Injectable({
  providedIn: 'root'
})
export class WebsocketService implements OnInit {

  private myWebSocket:WebSocketSubject<any>

  constructor() {
    this.myWebSocket = webSocket('ws://localhost:8089/subscribe');
  }

  ngOnInit(){
    this.connect();
  }

  connect(){
    return this.myWebSocket.asObservable()
  }

  diconnet(){
    return this.myWebSocket.unsubscribe()
  }

}
