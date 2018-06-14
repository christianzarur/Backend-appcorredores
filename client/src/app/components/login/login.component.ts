import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../models/user';
import { UserService } from "../../services/user.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'], 
  providers: [UserService]
})
export class LoginComponent implements OnInit {
  public title:string;
  public user :User;
  public status: string;
  public identity;
  public token;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService
    
  ) { 
    this.title = 'Identificate';
    this.user = new User("",
      "",
      "",
      "",
      "",
      "",
      "ROLE_USER",
      "");
  }

  ngOnInit() {
    console.log('Componente de login cargando...');

  }

  onSubmit(){
    //logear al user
    this._userService.singup(this.user).subscribe(
      response => {
        this.identity = response.user;
        console.log(this.identity)
        if (!this.identity || !this.identity._id) {
          this.status = 'error';
        }else{
          this.status = 'success'
          // persistir datos del usuario
          localStorage.setItem('identity', JSON.stringify(this.identity));

          //conseguir el token
          this.getToken();
        }
        this.status = 'exitoso';

      },  
      error =>{
        var errorMsj = <any>error;
        if (errorMsj !=null) {
          this.status = 'error';
        }
      }
    );
  }

  getToken(){
    this._userService.singup(this.user, 'true').subscribe(
      response => {
        this.token = response.token;
        console.log(this.token)
        if (this.token.lenght <= 0) {
          this.status = 'error';
        } else {
          this.status = 'exitoso';
          
          // persistir el token
          localStorage.setItem('token', this.token);
          //conseguir los contadores o estadistias del usuario

          this._router.navigate(['/']);
        }


      },
      error => {
        var errorMsj = <any>error;
        if (errorMsj != null) {
          this.status = 'error';
        }
      }
    );
  }
}


