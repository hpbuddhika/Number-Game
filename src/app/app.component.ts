import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GameService } from './game.service';
import { WebsocketService } from './websocket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  gameStartedProgressbar = false;
  count = 0;
  showCount = false;
  playerList: PlayerDetails[] = [];
  gameReset = false;
  showWinner = false;
  winner = '';
  severErr = false;
  showGameInProgress = false;
  message = '';
  numbers: NumberValue[] = [
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

  constructor(
    private webSocketService: WebsocketService,
    private gameService: GameService,
    private snackBar: MatSnackBar

  ) {

  }
  ngOnInit(): void {
    this.connectWebSocket();
  }

  connectWebSocket(): void{
    this.webSocketService.connect().subscribe(
      msg => {
        this.message = msg.type;
        this.severErr = false;
        if (msg.type === 'Game Waiting') {
          //  console.log("____waiting to game to start______");
          this.gameStartedProgressbar = true;

        } else if (msg.type === 'Countdown Started' || msg.type === 'Counting Down') {
          //  console.log("counting"
          this.showCount = true;
          this.count = msg.data;
          this.gameStartedProgressbar = false;
        } else if (msg.type === 'Game Started') {
          this.showWinner = false;
          this.showCount = false;
          this.gameReset = false;
          this.showGameInProgress = true;
        } else if (msg.type === 'Played Round') {
          // console.log("______game playing__________")
          // console.log("______rs________"+ JSON.stringify(msg))
          this.playerList = msg.data.leader_board;
          // console.log("player list:  " + JSON.stringify(this.playerList))
        } else if (msg.type === 'Game Reset') {
          this.playerList = [];
          this.gameReset = true;
          // this.showWinner = false;
        } else if (msg.type === 'Game Completed' && msg.data.name && msg.data.winner) {
          // console.log("there is a winner: " + msg.data.name)
          this.showWinner = true;
          this.winner = msg.data.name;
          this.showGameInProgress = false;
        }
       // console.log("msg :   " + JSON.stringify(msg))
      },
      err => {
        console.log(JSON.stringify(err.error));
        console.log('can not connect to the server');
        this.severErr = true;
      },

      () => console.log('complete')
      // Called when connection is closed (for whatever reason)
    );
  }



  submit(form: any): void {

    const playerName = form.playerName;
    const firstNumber = form.firstNumber;
    const secondNumber = form.secondNumber;

    const userDeatails = {
      name: playerName,
      first: firstNumber,
      second: secondNumber
    };

    this.joinGame(userDeatails);

  }


  joinGame(userDetails: UserDetails): void {
    this.gameService.joinGame(userDetails).subscribe(
      msg => {
        console.log(JSON.stringify(msg));
        this.severErr = false;
        this.join();
        this.snackBar.open('Welcome to the game, player ;)', 'OK', {
          duration: 2000,
        });
      },

      err => {
        if (err.error.title === 'Invalid Request') {
          this.snackBar.open('There is already a player here with that name', 'oops', {
            duration: 2000,
          });
        }
        console.log('err in server:');


      },
    );
  }

  join(): void {
   console.log('you will be added to the next round');
  }

}

interface NumberValue {
  value: number;
}

interface UserDetails {
  name: string;
  first: number;
  second: number;
}

interface PlayerDetails {
  'name': string;
  'upper': number;
  'lower': number;
  'score': number;
  'winner': boolean;
}
