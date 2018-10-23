import { Directive, ElementRef, Renderer2 } from '@angular/core';

@Directive({
  selector: '[hiddenScroll]'
})
export class HiddenScrollDirective {

  private availbleHeight: number = 0;
  private maxHeight: number = 0;
  private scrollbleHeight: number = 0;
  private element: any;
  private handleElement: any;
  private initX: number = 0;
  private initY: number = 0;
  private cuurentX: number = 0;
  private currentY: number = 0;
  private mouseDown: boolean = false;
  private currentScrollY: number = 0;
  private currentScrollX: number = 0;
  private wheel = () => { };
  private down = () => { };
  private up = () => { };
  private move = () => { };

  constructor(el: ElementRef, private renderer: Renderer2) {
    this.element = el.nativeElement;
    this.renderer.listen(window, 'resize', () => { this.render() });
    let mutationObserver = new MutationObserver((changes:any, observer: any) => {
      let contentChanged=false;
      changes.forEach(change => {
        if(!contentChanged && change.type == "childList"){
          contentChanged=true;
        }
      });
      if (contentChanged) {
        this.render()
      }
    });
    mutationObserver.observe(this.element, {
      attributes: true,
      characterData: true,
      childList: true,
      subtree: true,
      attributeOldValue: true,
      characterDataOldValue: true
    });
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.render();
  }

  render() {
    this.availbleHeight = this.element.offsetHeight;
    this.handleElement = this.element.childNodes[0];//('div')
    this.maxHeight = this.handleElement.scrollHeight ;
    this.scrollbleHeight = this.maxHeight - this.availbleHeight;
    this.wheel();
    this.down();
    this.move();
    this.up();
    this.getCurrentScroll();
    this.currentScrollY = ((this.currentScrollY >= 0) ? 0 : this.currentScrollY);
    this.currentScrollY = ((Math.abs(this.currentScrollY) >= this.scrollbleHeight) ? -this.scrollbleHeight : this.currentScrollY);
    this.handleElement.style.transform = `translate3d(0,${this.currentScrollY}px,0)`;
    this.wheel = this.renderer.listen(this.handleElement, 'wheel', (event) => {
      this.currentScrollY = this.currentScrollY + ((event.deltaY < 0) ? 10 : -10);
      this.currentScrollY = ((this.currentScrollY >= 0) ? 0 : this.currentScrollY);
      this.currentScrollY = ((Math.abs(this.currentScrollY) >= this.scrollbleHeight) ? -this.scrollbleHeight : this.currentScrollY);
      if (this.currentScrollY <= 0 && Math.abs(this.currentScrollY) <= this.scrollbleHeight) {
        this.handleElement.style.transform = `translate3d(0,${this.currentScrollY}px,0)`;
      }

    });
    this.down = this.renderer.listen(this.handleElement, 'mousedown', (event) => {
      this.initX = event.screenX;
      this.initY = event.screenY;
      this.mouseDown = true;
      this.getCurrentScroll();
    });
    this.move = this.renderer.listen(this.handleElement, 'mousemove', (event) => {
      if (this.mouseDown) {
        this.currentScrollY = this.currentScrollY + (event.screenY - this.initY);
        this.initX = event.screenX;
        this.initY = event.screenY;
        if (this.currentScrollY <= 0 && Math.abs(this.currentScrollY) <= this.scrollbleHeight) {
          this.handleElement.style.transform = `translate3d(0,${this.currentScrollY}px,0)`;
        }
      }
    });
    this.up = this.renderer.listen(document, 'mouseup', (event) => {
      this.mouseDown = false;
    });
  }

  private getCurrentScroll() {
    let no = (this.handleElement.style.transform).replace('translate3d(', '').replace(')', '').replace('px', '').split(',');
    this.currentScrollX = isNaN(parseInt(no[0]))?0:parseInt(no[0]);
    this.currentScrollY = isNaN(parseInt(no[1]))?0:parseInt(no[1]);
  }

}
