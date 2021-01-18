import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GameServiceService {

  constructor(private http: HttpClient) { }

  configUrl = 'http://localhost:8089/join';

  joinGame(reqObj:any) {
    return this.http.post(this.configUrl,reqObj);
  }


}
