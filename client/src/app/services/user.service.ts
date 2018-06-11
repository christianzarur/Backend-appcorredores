import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import { GLOBAL } from "./global";
import { User } from '../components/models/user';

@Injectable()

export class UserService {
    public url:string;
    constructor(public _http: HttpClient) {
        this.url = GLOBAL.url;
    }

    register(user: User): Observable<any>{
        let params = JSON.stringify(user);
        let headers = new HttpHeaders().set('Content-type', 'application/json')

        return this._http.post(this.url +'registro', params, {headers:headers})
    }
}