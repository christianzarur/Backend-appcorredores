import { Component, OnInit, DoCheck } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { GLOBAL } from '../../../services/global';
import { FollowService } from "../../../services/follow.service";
import { Follow } from "../../../components/models/follow";
import { Mensaje } from '../../../components/models/mensaje';
import { User } from '../../../components/models/user';
import { MessageService } from '../../../services/message.service';
import { UserService } from '../../../services/user.service';



@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css'],
  providers:[FollowService, MessageService]
})
export class AddComponent implements OnInit {
  public title: string;
  public message: Mensaje;
  public identity;
  public token;
  public url: string;
  public status: String;
  public follows;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _followService: FollowService,
    private _messageService: MessageService,
    private _userService: UserService
  ) {
    this.title = 'Enviar Mensajes';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
    this.message = new Mensaje('', '', '', '', this.identity._id, '');

  }

  ngOnInit() {
    console.log('add component cargado');
  }

}
