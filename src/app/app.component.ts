import { Component, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'qnews';
  currentTab=0;
  constructor(private http:HttpClient){
  }
  tabs:any[]=[
    {
      title:'Home',
    },
    {
      title:'Entertainment',
    },
    {
      title:'Popular',
    },
    {
      title:'National',
    },
    {
      title:'Sports',
    },
    {
      title:'Special',
    },
    {
      title:'Other',
    },
    {
      title:'Audio Launch',
    },


  ];
  images=[
    'src/assets/img1.jpg',
    'src/assets/img2.jpg',
    'src/assets/img3.jpg',
    'src/assets/img4.jpg',
  ];
  sample(){
    console.log('sample');
  }
}
