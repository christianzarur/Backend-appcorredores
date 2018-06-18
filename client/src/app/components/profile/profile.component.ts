import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../models/user';
import { UserService } from '../../services/user.service';
import { GLOBAL } from '../../services/global';
import { FollowService } from "../../services/follow.service";
import { Follow } from "../models/follow";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers: [UserService, FollowService]
})
export class ProfileComponent implements OnInit {
  public title: string;
  public url: string;
  public identity;
  public token;
  public status: string;
  public user: User;
  public stats;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _followService: FollowService
  ) {

    this.title = 'profile';
    this.url = GLOBAL.url;
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken()
    }

  ngOnInit() {
    this.loadPage();
  }

  loadPage(){
    this._route.params.subscribe(params=>{
      let id = params['id'];
      this.getUser(id);
      this.getCounters(id);
    });
  }


  getUser(id){

    this._userService.getUser(id).subscribe(
      response=>{
        if (response.user) {
          this.user = response.user;
        }else{
          this.status='error';
        }
      },
      error => {
        console.log(<any>error);
        this._router.navigate(['/perfil', this.identity._id]);
      }
    );
  }

  getCounters(id){
    this._userService.getCounters(id).subscribe(
      response=>{
        this.stats=response;
      },
      error=>{
        console.log(<any>error);
      }
    )
  }
}
