import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../models/user';
import { UserService } from "../../services/user.service";

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css'],
  providers: [UserService]
})
export class UserEditComponent implements OnInit {
  public title: string;
  public user: User;
  public status: string;
  public identity;
  public token;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService
  ) { 
    this.title = 'Actualizar mis datos';
    this.user = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.identity = this.user;
  }

  ngOnInit() {
    console.log(this.user);
    console.log('se ha cargado la edicion de datos');


  }

  onSubmit(){
    console.log(this.user);
    this._userService.updateUser(this.user).subscribe(
      response => {
        if (!response.user) {
          this.status = 'error';
        }else{
          this.status = 'exitoso';
          localStorage.setItem('identity', JSON.stringify(this.user));
          this.identity = this.user;

          //SUBIDA DE IMAGEN
        }
      },
      error =>{
        var errorMsj = <any>error;
        console.log(errorMsj);
        if (errorMsj != null) {
          this.status = 'error'
        }
      }
    );
  }

}
