import { Component, OnInit, Input, ElementRef, Renderer2 } from '@angular/core';

@Component({
  selector: 'slide-container',
  templateUrl: './slide-container.component.html',
  styleUrls: ['./slide-container.component.css']
})
export class SlideContainerComponent implements OnInit {
  private element;
  private listenerElement;
  private slideWidth: number;
  private innerWidth: number;
  private listners: any[] = [];
  private startX: number = 0;
  private startY: number = 0;
  private initX: number = 0;
  private initY: number = 0;
  private currentScroll: number = 0;
  private allowedX: number;
  @Input('currentTab') currentTab:number=0;
  @Input('moretext') moretext:string='MORE';
  @Input('heading') heading:string='Sample'
  constructor(ele: ElementRef, private renderer: Renderer2) {
    this.element = ele.nativeElement;
  }

  ngOnInit() {
  }


  ngAfterViewInit() {
    this.listenerElement = this.element.querySelector('.slide-content');
    this.listenerElement.style.transform = `translate3d(0px,0px,0px)`;
    this.setEvents(this.listenerElement);
    this.innerWidth = this.listenerElement.clientWidth;
    let lis = this.listenerElement.querySelectorAll('.slide-content > div');
    this.slideWidth = 0;
    for (let i = 0; i < lis.length; i++) {
      this.slideWidth += lis[i].clientWidth;
    }
    this.listenerElement.style.width = this.slideWidth + 'px';
    this.allowedX = (this.innerWidth + 10) - this.slideWidth;
    console.log(this.allowedX);
    this.setContent(this.currentTab);

  }
  setTab(ind, event) {
    this.getCurrentScroll()
    let width = event.target.clientWidth / 2;
    let left = event.target.offsetLeft + this.currentScroll;
    let center = this.innerWidth / 2;
    let reqLeft = left + width;
    let currentPos = center - left - width + this.currentScroll;
    currentPos = (currentPos > 0) ? 0 : ((currentPos < this.allowedX) ? this.allowedX : currentPos);
    this.listenerElement.style.transform = `translate3d(${currentPos}px,0px,0px)`;
    this.setContent(ind);
  }
  setContent(ind){
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
  getCurrentScroll() {
    let no = (this.listenerElement.style.transform).replace('translate3d(', '').replace(')', '').replace('px', '').split(',')[0];
    this.currentScroll = parseInt(no);
  }
  setEvents(el) {
    this.listners.push(
      this.renderer.listen(el, 'touchstart', (event) => {
        this.initX = event.targetTouches[0].screenX;
        this.initY = event.targetTouches[0].screenY;
        this.getCurrentScroll();
      })
    );
    this.listners.push(
      this.renderer.listen(el, 'touchmove', (event) => {
        this.listenerElement.style.transition = 'all 0s ease 0s';
        this.startX = event.targetTouches[0].screenX;
        this.startY = event.targetTouches[0].screenY;
        let diff = this.initX - this.startX;
        diff = this.currentScroll - diff;
        if (diff >= this.allowedX && diff < 1) {
          diff = (this.isNear(diff, this.allowedX)) ? this.allowedX : diff;
          diff = (this.isNear(diff, 0)) ? 0 : diff;
          this.listenerElement.style.transform = 'translate3d(' + diff + 'px,0px,0px)';
        }
      })
    );
    this.listners.push(
      this.renderer.listen(el, 'touchend', (event) => {
        this.listenerElement.style.transition = 'all 1s ease 0s';
      })
    );
  }
  isNear(no, original) {
    return (no <= (original + 4) && no >= (original - 4));
  }
  ngOnDestroy(){
    this.listners.forEach((v)=>{v()});
  }


}
