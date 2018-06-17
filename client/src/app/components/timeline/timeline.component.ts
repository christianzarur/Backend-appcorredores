import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Publication } from '../models/publication';
import { GLOBAL } from '../../services/global';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css'],
  providers: [UserService]

})
export class TimelineComponent implements OnInit {
  public title: string;
  public identity;
  public token;
  public url: string;

  constructor(private _route: ActivatedRoute,
  private _router: Router,
  private _userService: UserService
  ) {
    this.title = 'Timeline';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;

   }
  

  ngOnInit() {
    console.log('Timeline cargado');
  }

}
