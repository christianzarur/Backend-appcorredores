import { Component, OnInit, DoCheck } from '@angular/core';

@Component({
  selector: 'app-received',
  templateUrl: './received.component.html',
  styleUrls: ['./received.component.css']
})
export class ReceivedComponent implements OnInit {
  public title: string;

  constructor() {
    this.title = 'Mensajes recibidos';
  }

  ngOnInit() {
    console.log('received component cargado');
  }

}