import { Component, OnInit } from '@angular/core';

interface User {
  name: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  title = 'app';
  constructor () {}

  ngOnInit() {
  }

}
