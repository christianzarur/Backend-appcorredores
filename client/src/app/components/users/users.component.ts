import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../models/user';
import { UserService } from '../../services/user.service';
import { GLOBAL } from '../../services/global';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
  providers: [UserService]
})
export class UsersComponent implements OnInit {
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

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService
  ) {
    this.title = 'Gente';
    this.url = GLOBAL.url;
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
   }

  ngOnInit() {
    console.log("users.components ha sido cargado");
    this.actualPage();
  }

  actualPage(){
    this._route.params.subscribe(params =>{
      let page = +params['page'];
      this.page = page;
      
      if (!params['page']){
        page = 1;
      }
      if (!page) {
        page = 1;
      }else{
        this.next_page = page + 1;
        this.prev_page = page - 1;

        if (this.prev_page <= 0) {
          this.prev_page = 1;
        }
      }
      //devolver listado de usuarios
      this.getUsers(page);
    });
  }

  getUsers(page){
    this._userService.getUsers(page).subscribe(
      response=>{
        if (!response.users) {
          this.status = 'error';
        }else{
          console.log(response);
          this.total = response.total;
          this.users = response.users;
          this.pages = response.pages;
          console.log(this.pages);
          console.log(page);
          if (page > this.pages) {
            this._router.navigate(['/gente', 1]);
          }
        }
      },
      error =>{
        var errorMsj = <any>error;
        console.log(errorMsj);

        if (errorMsj != null) {
          this.status = 'error';
        }
      }
    );
  }




}