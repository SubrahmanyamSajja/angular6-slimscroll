import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  showMenu:boolean=false;
  options:any[]=[
    {
      title:'Live TV'
    },
    {
      title:'Share App',
    },
    {
      title:'Privacy Policy'
    }

  ];
  constructor() { }

  ngOnInit() {

  }

  showOption(option){
    this.showMenu=false;
    console.log(option);
  }

}
