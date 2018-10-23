import { Component, OnInit, ViewEncapsulation, AfterViewInit, ElementRef, Renderer2, AfterViewChecked, Input, OnChanges, HostListener } from '@angular/core';
import { Observable } from 'rxjs';
import { TouchSequence } from 'selenium-webdriver';

@Component({
  selector: 'image-slider',
  templateUrl: './image-slide.component.html',
  styleUrls: ['./image-slide.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ImageSlideComponent implements OnInit, AfterViewInit {
  currentImage: number = 2;
  startX: number;
  startY: number;
  initX: number;
  initY: number;
  isMovingLeft: boolean = false;
  isMovingRight: boolean = false;
  isMovingUp: boolean = false;
  isMovingDown: boolean = false;
  listners: any[] = [];
  private element;
  slides: any[];
  widthInPx: number = 0;
  pxToPercent: number = 1;
  initNextLeft: number;
  initPrevLeft: number;
  private slideWidth: number = 1;
  private innerWidth: number = 0;
  private listenerElement;
  private currentScroll: number = 0;
  private slidesCount: number = 0;
  private bullets:any[]=[];
  private isReverse:boolean=false;
  private isCleared:boolean=false;
  private interval;
  @Input('delay') delay:number=1000;
  constructor(ele: ElementRef, private renderer: Renderer2) {
    this.element = ele.nativeElement;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.setCssAnimation();
    this.setItems();
  }

  ngOnInit() {
    this.setAnimation();
  }
  removeAnimation(){
    this.isCleared=true;
    clearInterval(this.interval);;
  }
  setAnimation(){
    if(this.isCleared){
      this.isCleared=false;
      this.interval=setInterval(()=>{this.auto()},this.delay);
    }
  }
  setAdditionals(){
    this.bullets=[];
    this.bullets[this.slidesCount]='';

  }
  ngAfterViewInit() {
    this.setItems();
  }
  
  setItems() {
    this.slideWidth = this.element.querySelector('.image-slider').clientWidth;
    let items = this.element.querySelectorAll('.image-slider-inner > div');
    this.slidesCount = items.length - 1;
    this.innerWidth = this.slideWidth * items.length;
    setTimeout(()=>{this.setAdditionals()},100);
    this.listenerElement = this.element.querySelector('.image-slider-inner');
    this.listenerElement.style.width = this.innerWidth + 'px';
    this.listenerElement.style.transform = 'translate3d(-' + (this.currentImage * this.slideWidth) + 'px,0px,0px)';
    this.listners.forEach((v)=>{v();});
    this.setEvents(this.listenerElement);

  }

  setEvents(el) {
    this.listners.push(
      this.renderer.listen(el, 'touchstart', (event) => {
        this.startX = event.targetTouches[0].screenX;
        this.startY = event.targetTouches[0].screenY;
        this.initX = event.targetTouches[0].screenX;
        this.initY = event.targetTouches[0].screenY;
        let no = (this.listenerElement.style.transform).replace('translate3d(', '').replace(')', '').replace('px', '').split(',')[0];
        this.listenerElement.style.transition = 'all 0s ease 0s';
        this.currentScroll = parseInt(no);
        this.removeAnimation();
      })
    );
    this.listners.push(
      this.renderer.listen(el, 'touchmove', (event) => {
        this.isMovingLeft = this.startX > event.targetTouches[0].screenX;
        this.isMovingRight = this.startX < event.targetTouches[0].screenX;
        this.isMovingUp = this.startY < event.targetTouches[0].screenY;
        this.isMovingDown = this.startY > event.targetTouches[0].screenY;
        this.startX = event.targetTouches[0].screenX;
        this.startY = event.targetTouches[0].screenY;
        let diff = this.initX - this.startX;
        if (this.isMovingLeft) {
          diff = this.currentScroll - diff;
          if (Math.abs(this.currentScroll) != Math.abs(this.innerWidth - this.slideWidth)) {
            this.listenerElement.style.transform = 'translate3d(' + diff + 'px,0px,0px)';
          }
        } else if (this.isMovingRight) {
          if (Math.abs(this.currentScroll) != 0) {
            this.listenerElement.style.transform = 'translate3d(' + (this.currentScroll - diff) + 'px,0px,0px)';
          }
        }
      })
    );
    this.listners.push(
      this.renderer.listen(el, 'touchend', (event) => {
        if (this.isMovingLeft && this.currentImage < this.slidesCount) {
          this.currentImage++;
        } else if (this.isMovingRight && this.currentImage > 0) {
          this.currentImage--;
        }
        this.slide();
        
      })
    );
  }
  slide() {
    this.listenerElement.style.transform = 'translate3d(-' + (this.currentImage * this.slideWidth) + 'px,0px,0px)';
    this.setCssAnimation();
    this.setAnimation();
  }

  setCssAnimation(){
    this.listenerElement.style.transition = 'all 1s ease 0s';
    setTimeout(() => {
      this.listenerElement.style.transition = 'all 2s ease 0s';
    }, 500)
  }

  setCurrent(ind){
    this.removeAnimation();
    this.currentImage=ind;
    this.slide();
  }
  prev(){
    if (this.currentImage > 0) {
      this.currentImage--;
      this.slide();
    } else {
      this.isReverse=false;
    }
  }
  next(){
    if (this.currentImage < this.slidesCount)  {
      this.currentImage++;
      this.slide();
    } else {
      this.isReverse=true;
    }
  }

  auto(){
      if(this.isReverse){
        this.prev();
      } else {
        this.next();
      }
  }
  
  ngOnDestroy(){
    this.listners.forEach((v)=>{v()});
  }

}
