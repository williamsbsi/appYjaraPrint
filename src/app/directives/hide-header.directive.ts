import { Directive, Input, Renderer2 } from '@angular/core';
import { DomController } from '@ionic/angular';

@Directive({
  selector: '[appHideHeader]',
  host: {
    '(ionScroll)' : 'onContentScroll($event)'
  }
})
export class HideHeaderDirective {
  @Input('header') header: any;
  private lastY: number = 0;
  constructor(
    private renderer: Renderer2,
    private domCtrl: DomController
  ) {

  }

  ngOnInit() {
    this.header = this.header.el;
    this.domCtrl.write(() => {
      this.renderer.setStyle(this.header, 'transition', 'background 400ms');
    });
    
  }
  onContentScroll(event: any) {
    if (event.detail.scrollTop > this.lastY) {
      //this.renderer.setStyle(this.header, 'margin-top', `-${this.header.clientHeight}px`);
      this.renderer.setStyle(this.header, 'background', '#ffffff');
    } else if (event.detail.scrollTop === 0) {
      this.renderer.setStyle(this.header, 'background', 'none');
    } else {
      //this.renderer.setStyle(this.header, 'margin-top', '0px');
      this.renderer.setStyle(this.header, 'background', '#ffffff');
    }
    this.lastY = event.detail.scrollTop;
  }

}
