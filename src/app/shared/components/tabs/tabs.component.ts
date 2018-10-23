import { Component, OnInit, ElementRef, AfterViewInit, Input } from '@angular/core';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.css']
})
export class TabsComponent implements OnInit,AfterViewInit {
  @Input('tabs') tabs=[];
  currentTab:number=0;
  private element;
  constructor(ele:ElementRef){
      this.element=ele.nativeElement;
  }
  ngOnInit(){

  }
  setTab(ind){
    let tabElements=this.element.querySelectorAll('.tab-content > div');
    for(let i=0;i<tabElements.length;i++){
      tabElements[i].classList.remove('active');
      if(i==ind){
          tabElements[i].style.transform='none';
          tabElements[i].classList.add('active');
      } else if(i<ind){
        tabElements[i].style.transform='translate3d(-100%, 0px, 0px)';
      } else {
        tabElements[i].style.transform='translate3d(100%, 0px, 0px)';
      }
    }
  }
  ngAfterViewInit(){
    this.setTab(this.currentTab);
  }

  
}
