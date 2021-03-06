import { Component, OnInit, EventEmitter, Input, Output  } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { UserService } from '../../services/user.service';
import { GLOBAL } from '../../services/global';
import { Publication } from "../models/publication";
import { PublicationService } from '../../services/publication.service';

@Component({
  selector: 'app-newsidebar',
  templateUrl: './newsidebar.component.html',
  styleUrls: ['./newsidebar.component.css'],
  providers: [UserService, PublicationService]

})
export class NewsidebarComponent implements OnInit {
  public url;
  public identity;
  public token;
  public status;
  public stats;
  public publication: Publication;
  private SideBarStatus: boolean = true; 
  constructor(
    private _userService: UserService,
    private _publicationService: PublicationService,
    private _route: ActivatedRoute,
    private _router: Router,
  ) { 
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.stats = this._userService.getStats();
    this.url = GLOBAL.url;
    this.publication = new Publication("", "", "", "", this.identity._id);
  }

  ngOnInit() {
  }
  toggleSideBar() {
    this.SideBarStatus = !this.SideBarStatus;
  } 
  onSubmit(form) {

    this._publicationService.addPublication(this.token, this.publication).subscribe(
      response => {
        if (response.publication) {
          //this.publication = response.publication;
          this.status = 'exitoso';
          form.reset();
          this._router.navigate(['/timeline']);
        } else {
          this.status = 'error';
        }
      },
      error => {
        var errorMsj = <any>error;
        console.log(errorMsj);
        if (errorMsj != null) {
          this.status = 'error'
        }
      }
    );
  }

  //output
  @Output() sended = new EventEmitter;

  sendPublication(event) {
    console.log(event);
    this.sended.emit({ send: 'true' });
  }

}
