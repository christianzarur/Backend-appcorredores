import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global';
import { Mensaje } from '../components/models/mensaje';

@Injectable()

export class MessageService {
    public url: string;

    constructor(private _http: HttpClient){
        this.url = GLOBAL.url;
    }

    addMessage(token, message): Observable<any>{
        let params = JSON.stringify(message);
        let headers = new HttpHeaders().set('Content-type', 'application/json')
                                        .set('Authorization', token);
        return this._http.post(this.url + 'mensaje', params, { headers: headers });
    }

    getMyMessage(token, page = 1): Observable<any> {
        let headers = new HttpHeaders().set('Content-type', 'application/json')
                                        .set('Authorization', token);
        return this._http.get(this.url + 'mis-mensajes/'+page ,{ headers: headers });
    }

    getEmmitMessage(token, page = 1): Observable<any> {
        let headers = new HttpHeaders().set('Content-type', 'application/json')
                                        .set('Authorization', token);
        return this._http.get(this.url + 'mensajes-enviados/' + page, { headers: headers });
    }

}