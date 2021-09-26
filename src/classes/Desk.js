export class Desk {

  constructor(x,y,w,h) {
    this.x=x;
    this.y=y;
    this.w=w;
    this.h=h;
    this.name="";
    this.id="";
    this.saved = false;
    this.apiId = null;
  }

  contains(x,y) {
    return this.x <= x && x <= this.x + this.w &&
       this.y <= y && y <= this.y + this.h;
  }

  containsScale(x,y,scale) {
    let x1 = this.x/scale
    let y1 = this.y/scale
    let w1 = this.w/scale
    let h1 = this.h/scale
    return x1 <= x && x <= x1 + w1 &&
       y1 <= y && y <= y1 + h1;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.rect(this.x, this.y,this.w,this.h);
    ctx.stroke();
  }

  //Draw to f - factor for scaling
  drawScale(ctx,f,drawCol) {
    ctx.beginPath();
    ctx.strokeStyle = drawCol;
    ctx.rect(this.x/f, this.y/f,this.w/f,this.h/f);
    ctx.stroke();
  }

  //GETTERS
  getName() {
    return this.name;
  }

  getId() {
    return this.id;
  }


  //Setters
  setName(name) {
    this.name=name;
  }

  setId(id) {
    if(this.id === "") {
      this.id = id;
    }
  }

  toJson() {
    let obj = {
      deskId: this.id,
      name : this.name,
      x: this.x,
      y: this.y,
      w: this.w,
      h: this.h
    }
    return obj;
  }

}
