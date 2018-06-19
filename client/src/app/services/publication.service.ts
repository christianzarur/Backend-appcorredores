import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global';
import { Publication } from '../components/models/publication';

@Injectable()

export class PublicationService {
    public url: string;


    constructor(public _http: HttpClient) {
        this.url = GLOBAL.url;
    }

    addPublication(token, publication): Observable<any> {
        let params = JSON.stringify(publication);
        let headers = new HttpHeaders().set('Content-type', 'application/json')
                                        .set('Authorization', token);
        return this._http.post(this.url + 'publication', params, { headers: headers});
    }

    getPublicatons(token, page = 1): Observable<any>{
        let headers = new HttpHeaders().set('Content-type', 'application/json')
                                        .set('Authorization', token); 
        return this._http.get(this.url + 'publications/'+page, { headers: headers });
                
    }

    getPublicatonsUser(token, user_id, page = 1): Observable<any>{
        let headers = new HttpHeaders().set('Content-type', 'application/json')
                                        .set('Authorization', token); 
        return this._http.get(this.url + 'publications-user/'+user_id + '/' +page, { headers: headers });
                
    }

    deletePublication(token, id): Observable<any>{
        let headers = new HttpHeaders().set('Content-type', 'application/json')
                                        .set('Authorization', token);
        return this._http.delete(this.url + 'publications/' + id, { headers: headers });
    }
}