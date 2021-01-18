import { stripGeneratedFileSuffix } from '@angular/compiler/src/aot/util';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GameServiceService } from './game-service.service';
import { WebsocketService } from './websocket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  gameStartedProgressbar: boolean = false;
  count: number = 0;
  showCount: boolean = false;
  playerList: PlayerDetails[] = [];
  gameReset: boolean = false;
  showWinner: boolean = false;
  winner: string = "";
  severErr:boolean = false;

  constructor(
    private webSocketService: WebsocketService,
    private gameService: GameServiceService,
    private _snackBar: MatSnackBar

  ) {

  }
  ngOnInit(): void {
    this.webSocketService.connect().subscribe(
      msg => {
        this.severErr = false;
        if (msg.type === "Game Waiting") {
          //  console.log("____waiting to game to start______");
          this.gameStartedProgressbar = true;

        } else if (msg.type === "Countdown Started" || msg.type === "Counting Down") {
          //  console.log("counting"
          this.showCount = true;
          this.count = msg.data;
          this.gameStartedProgressbar = false;
        } else if (msg.type === "Game Started") {
          this.showWinner = false;
          this.showCount = false;
          this.gameReset = false
        } else if (msg.type === "Played Round") {
          //console.log("______game playing__________")
          // console.log("______rs________"+ JSON.stringify(msg))
          this.playerList = msg.data.leader_board
          // console.log("player list:  " + JSON.stringify(this.playerList))
        } else if (msg.type === "Game Reset") {
          this.playerList = [];
          this.gameReset = true;
          // this.showWinner = false;
        } else if (msg.type === "Game Completed" && msg.data.name && msg.data.winner) {
          // console.log("there is a winner: " + msg.data.name)
          this.showWinner = true;
          this.winner = msg.data.name;
        }
        console.log("msg :   " + JSON.stringify(msg))
      },
      err => {
        console.log(JSON.stringify(err.error))
        console.log("can not connect to the server")
        this.severErr = true;
      },

      () => console.log('complete')
      // Called when connection is closed (for whatever reason)
    );
  }

  userDeatails = {
    name: "Buddhika 2",
    first: 2,
    second: 7
  }

  submit(form: any) {

    var playerName = form.playerName;
    var firstNumber = form.firstNumber;
    var secondNumber = form.secondNumber;

    this.userDeatails = {
      name: playerName,
      first: firstNumber,
      second: secondNumber
    }

    this.joinGame(this.userDeatails);
  }

  unsubscribe() {
    this.webSocketService.diconnet();
  }

  joinGame(userDetails: UserDetails) {
    this.gameService.joinGame(userDetails).subscribe(
      msg => {
        console.log(JSON.stringify(msg))
        this.severErr = false;
        this._snackBar.open("Welcome to the game, player ;)", "OK", {
          duration: 2000,
        });
      },

      err => {
        if (err.error.title === "Invalid Request") {
          this._snackBar.open("There is already a player here with that name", "oops", {
            duration: 2000,
          });
        }
        console.log("err in server:")
        this.severErr = true;

      },
    );
  }

  numbers: Number[] = [
    { value: 1 },
    { value: 2 },
    { value: 3 },
    { value: 4 },
    { value: 5 },
    { value: 6 },
    { value: 7 },
    { value: 8 },
    { value: 9 },
    { value: 10 },
  ];

}

interface Number {
  value: number;
}

interface UserDetails {
  name: string,
  first: number,
  second: number
}

interface PlayerDetails {
  "name": string,
  "upper": number,
  "lower": number,
  "score": number,
  "winner": boolean
}
