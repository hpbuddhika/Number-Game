import { JoinUserResponse } from './models/join.user.details.model';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { GameService } from './game.service';
import { JoinUserReqObj } from './models/join.user.reqobj.model';


describe('GameServiceService', () => {
  let service: GameService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [GameService]
    });
    service = TestBed.inject(GameService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should create GameService Instance', () => {
    expect(service).toBeTruthy();
  });

  it('should create a new user', () => {

    const userDetails: JoinUserReqObj = {
      name: 'Buddhikadd 2',
      first: 2,
      second: 7
    };

    const returnedObj: JoinUserResponse = {
      detail: 'Welcome to the game, player ;)',
      status: 200,
      title: 'Joined Game',
      type: 'Success'
    };

    service.joinGame(userDetails).subscribe(response => {
      expect(response).toBe(returnedObj);
    });

    const request = httpMock.expectOne(`${service.CONFIG_URL}`);

    expect(request.request.method).toBe('POST');

    request.flush(returnedObj);

  });

  it('should prevent creating new user with existing username', () => {

    const userDetails: JoinUserReqObj = {
      name: 'Buddhikadd 2',
      first: 2,
      second: 7
    };

    const returnedObj: JoinUserResponse = {
      detail: 'Invalid name: There is already a player here with that name',
      status: 400,
      title: 'Invalid Request',
      type: 'Error'
    };

    service.joinGame(userDetails).subscribe(response => {
      expect(response).toBe(returnedObj);
    });

    const request = httpMock.expectOne(`${service.CONFIG_URL}`);

    expect(request.request.method).toBe('POST');

    request.flush(returnedObj);

  });


});
