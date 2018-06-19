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
  public followed;
  public following;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _followService: FollowService
  ) {

    this.title = 'Perfil';
    this.url = GLOBAL.url;
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.followed = false;
    this.following = false;
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
          console.log(response);
          this.user = response.user;

          if (response.following && response.following._id) {
            this.following = true;
          }else{
            this.following = false;
          }

          if (response.followed && response.followed._id) {
            this.followed = true;
          }else{
            this.followed = false;
          }
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
        console.log(response);
        this.stats=response;
      },
      error=>{
        console.log(<any>error);
      }
    )
  }

  followUser(followed) {
    var follow = new Follow('', this.identity._id, followed);

    this._followService.addFollow(this.token, follow).subscribe(
      response => {
          this.following=true;
      },
      error => {
        var errorMsj = <any>error;
        console.log(errorMsj);

        if (errorMsj != null) {
          this.status = 'error';
        }
      }
    )
  }

  unfollowUser(followed) {
    this._followService.deleteFollow(this.token, followed).subscribe(
      response => {
        this.following = true;
      },
      error => {
        var errorMsj = <any>error;
        console.log(errorMsj);

        if (errorMsj != null) {
          this.status = 'error';
        }
      }
    )
  }

  public followUserOver;
  mouseEnter(user_id) {
    this.followUserOver = user_id;
  }
  mouseLeave() {
    this.followUserOver = 0
  }


}
