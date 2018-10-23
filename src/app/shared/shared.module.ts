import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsComponent } from './components/tabs/tabs.component';
import { ImageSlideComponent } from './components/image-slide/image-slide.component';
import { SlideMenuComponent } from './components/slide-menu/slide-menu.component';
import { SlideContainerComponent } from './components/slide-container/slide-container.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [TabsComponent, ImageSlideComponent, SlideMenuComponent, SlideContainerComponent],
  exports: [TabsComponent, ImageSlideComponent,SlideMenuComponent,SlideContainerComponent]

})
export class SharedModule { }
