import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../models/user';
import { UserService } from '../../services/user.service';
import { GLOBAL } from '../../services/global';
import { FollowService } from "../../services/follow.service";
import { Follow } from "../models/follow";

@Component({
  selector: 'app-following',
  templateUrl: './following.component.html',
  styleUrls: ['./following.component.css'], 
  providers: [UserService, FollowService]
})

export class FollowingComponent implements OnInit {
  public title: string;
  public url: string;
  public identity;
  public token;
  public status: string;
  public page;
  public next_page;
  public prev_page;
  public total;
  public pages;
  public users: User[];
  public follows;
  public following;
  public userPageId;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _followService: FollowService
  ) {
    this.title = 'Seguidos';
    this.url = GLOBAL.url;
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
  }

  ngOnInit() {
    console.log("siguiendo.components ha sido cargado");
    this.actualPage();
  }

  actualPage() {
    this._route.params.subscribe(params => {
      let user_id = params ['id'];
      this.userPageId= user_id;
      let page = +params['page'];
      this.page = page;

      if (!params['page']) {
        page = 1;
      }
      if (!page) {
        page = 1;
      } else {
        this.next_page = page + 1;
        this.prev_page = page - 1;

        if (this.prev_page <= 0) {
          this.prev_page = 1;
        }
      }
      //devolver listado de usuarios
      this.getFollows(user_id, page);
    });
  }

  getFollows(user_id, page) {
    this._followService.getFollowing(this.token, user_id, page).subscribe(
      response => {
        if (!response.seguidos) {
          this.status = 'error';
        } else {
          console.log(response);
          this.total = response.total;
          this.following = response.seguidos;
          this.pages = response.pages;
          this.follows = response.users_following;
          if (page > this.pages) {
            this._router.navigate(['/gente', 1]);
          }
        }
      },
      error => {
        var errorMsj = <any>error;
        console.log(errorMsj);

        if (errorMsj != null) {
          this.status = 'error';
        }
      }
    );
  }

  public followUserOver;
  mouseEnter(user_id) {
    this.followUserOver = user_id;
  }
  mouseLeave(user_id) {
    this.followUserOver = 0
  }

  followUser(followed) {
    var follow = new Follow('', this.identity._id, followed);

    this._followService.addFollow(this.token, follow).subscribe(
      response => {
        if (!response.follow) {
          this.status = 'error';
        } else {
          this.status = 'exitoso';
          this.follows.push(followed);
        }
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
        var search = this.follows.indexOf(followed);
        if (search != -1) {
          this.follows.splice(search, 1);
        }
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

}

