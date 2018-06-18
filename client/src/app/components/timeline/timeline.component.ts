import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Publication } from '../models/publication';
import { GLOBAL } from '../../services/global';
import { UserService } from '../../services/user.service';
import { PublicationService } from '../../services/publication.service';


@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css'],
  providers: [UserService, PublicationService]

})
export class TimelineComponent implements OnInit {
  public title: string;
  public identity;
  public token;
  public url: string;
  public status:string;
  public page;
  public publications: Publication[];
  public total;
  public pages;
  public itemsPerPage;

  constructor(private _route: ActivatedRoute,
  private _router: Router,
  private _userService: UserService,
  private _publicationService: PublicationService
  ) {
    this.title = 'Timeline';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
    this.page =1;

   }
  

  ngOnInit() {
    console.log('Timeline cargado');
    this.getPublications(this.page);
  }

  getPublications(page, adding=false){
    this._publicationService.getPublicatons(this.token, page).subscribe(
      response=>{
        if (response.publications) {
          this.total = response.total_items;
          this.pages= response.pages;
          this.itemsPerPage = response.items_per_page;
          if (!adding) {
            this.publications = response.publications;
          }else{
            var arrayA=this.publications;
            var arrayB=response.publications;
            this.publications = arrayA.concat(arrayB);

            // $("html, body").animate({scrollTop: $('body').prop("scrollHeight")},500)
          }
          if (page>this.pages) {
            //this._router.navigate(['/home']);
          }

        }else{
          this.status='error';
        }
      },
      error =>{
        var errorMsj = <any>error;
        console.log(errorMsj);
        if (errorMsj != null) {
          this.status = 'error'
        }
      }
    )
  }
  public noMore=false;
  viewMore(){
    if(this.publications.length == (this.total)){
      this.noMore = true;
    }else{
      this.page +=1;
    }
    this.getPublications(this.page, true);
  }
}
