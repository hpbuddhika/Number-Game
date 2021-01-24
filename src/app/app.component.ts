import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GameService } from './game.service';
import { WebsocketService } from './websocket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

  gameStartedProgressbar = false;
  joinGameToStart=false;
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
          this.joinGameToStart = true
          this.gameStartedProgressbar = true;
        } else if (msg.type === 'Countdown Started' || msg.type === 'Counting Down') {
          this.joinGameToStart = false;
          this.showCount = true;
          this.count = msg.data;
          this.gameStartedProgressbar = false;
        } else if (msg.type === 'Game Started') {
          this.showWinner = false;
          this.showCount = false;
          this.gameReset = false;
          this.showGameInProgress = true;
        } else if (msg.type === 'Played Round') {
          this.playerList = msg.data.leader_board;
        } else if (msg.type === 'Game Reset') {
          this.playerList = [];
          this.gameReset = true;
        } else if (msg.type === 'Game Completed' && msg.data.name && msg.data.winner) {
          this.showWinner = true;
          this.winner = msg.data.name;
          this.showGameInProgress = false;
        }
      },
      err => {
        console.log(JSON.stringify(err.error));
        console.log('can not connect to the server');
        this.severErr = true;
      },

      () => console.log('complete')

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
        this.snackBar.open('You will be added to the next Game', 'OK', {
          duration: 5000,
        });
      },

      err => {
        if (err.error.title === 'Invalid Request') {
          this.snackBar.open('There is already a player here with that name', 'oops', {
            duration: 5000,
          });
        }
        console.log('err in server:');


      },
    );
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
