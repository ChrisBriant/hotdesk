export class Rect {
  // let ctx;
  // let x=0;
  // let y=0;
  // let w=0;
  // let h=0;

  constructor(x,y,w,h,ctx) {
    this.ctx = ctx;
    this.x=x;
    this.y=y;
    this.w=w;
    this.h=h;
    this.name="";
  }

  contains(x,y) {
    //console.log('Contains',x,y,this.width,this.height,this.x,this.y);
    return this.x <= x && x <= this.x + this.w &&
       this.y <= y && y <= this.y + this.h;
  }

  draw() {
    this.ctx.beginPath();
    this.ctx.rect(this.x, this.y,this.w,this.h);
    this.ctx.stroke();
  }

  //GETTERS
  getName() {
    return this.name;
  }

  setName(name) {
    this.name=name;
  }

}
