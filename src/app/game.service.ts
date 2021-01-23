import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JoinUserResponse } from './models/join.user.details.model';
import { JoinUserReqObj } from './models/join.user.reqobj.model';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  constructor(private http: HttpClient) { }

  CONFIG_URL = 'http://localhost:8089/join';

  joinGame(reqObj: JoinUserReqObj): any {
    return this.http.post<JoinUserResponse>(this.CONFIG_URL, reqObj);
  }

}
