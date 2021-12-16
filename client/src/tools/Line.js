import Tool from "./Tool";

export default class Line extends Tool {
  constructor(canvas, socket, id) {
    super(canvas, socket, id);
    this.listen();
    this.name = 'Line';
  };

  listen() {
    this.canvas.onmouseup = this.mouseUpHandler.bind(this);
    this.canvas.onmousedown = this.mouseDownHandler.bind(this);
    this.canvas.onmousemove = this.mouseMoveHandler.bind(this);
  }

  mouseUpHandler(event) {
    this.mouseDown = false;
    this.socket.send(JSON.stringify({
      method: 'draw',
      id: this.id,
      figure: {
        type: 'line',
        x: this.startX,
        y: this.startY,
        color: this.ctx.fillStyle,
      }
    }))
  }

  mouseDownHandler(event) {
    this.mouseDown = true;
    this.ctx.beginPath();
    this.ctx.moveTo(this.currentX, this.currentY);
    this.saved = this.canvas.toDataURL();
    this.currentX = event.pageX - event.target.offsetLeft;
    this.currentY = event.pageY - event.target.offsetTop;
  }

  mouseMoveHandler(event) {
    if(this.mouseDown) {
      this.draw(event.pageX - event.target.offsetLeft, event.pageY - event.target.offsetTop);
    }
  }

  draw(x, y) {
    const img = new Image();
    img.src = this.saved;
    img.onload = async function() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
      this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height)
      this.ctx.beginPath();
      this.ctx.moveTo(this.currentX, this.currentY);
      this.ctx.lineTo(x, y);
      this.ctx.stroke();
    }.bind(this)
  }

  static lineDraw(ctx, x, y, color) {
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.moveTo(x, y);
    ctx.fill();
    ctx.stroke();
  }
};
