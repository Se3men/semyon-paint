import React from 'react';
import '../styles/toolbar.scss'
import Brush from '../tools/Brush';
import Rect from '../tools/Rect';
import Circle from '../tools/Circle';
import Eraser from '../tools/Eraser';
import Line from '../tools/Line'
import canvasState from '../store/canvasState';
import toolState from '../store/toolState';

const Toolbar = () => {

  const changeColor = event => {
    toolState.setStrokeColor(event.target.value);
    toolState.setFillColor(event.target.value);
  }
  
  const download = () => {
    const dataUrl = canvasState.canvas.toDataURL();
    console.log(dataUrl);
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = canvasState.sessionid + `.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  return (
    <div className='toolbar'>
      <button className='toolbar__btn brush' onClick={() => toolState.setTool(new Brush(canvasState.canvas, canvasState.socket, canvasState.sessionid))}></button>
      <button className='toolbar__btn rect' onClick={() => toolState.setTool(new Rect(canvasState.canvas, canvasState.socket, canvasState.sessionid))}></button>
      <button className='toolbar__btn circle' onClick={() => toolState.setTool(new Circle(canvasState.canvas, canvasState.socket, canvasState.sessionid))}></button>
      <button className='toolbar__btn eraser' onClick={() => toolState.setTool(new Eraser(canvasState.canvas, canvasState.socket, canvasState.sessionid))}></button>
      <button className='toolbar__btn line' onClick={() => toolState.setTool(new Line(canvasState.canvas, canvasState.socket, canvasState.sessionid))}></button>
      <input onChange={event => changeColor(event)} style={{marginLeft: 10}} type="color"/>
      <button className='toolbar__btn undo' onClick={() => canvasState.undo()} />
      <button className='toolbar__btn redo' onClick={() => canvasState.redo()} />
      <button className='toolbar__btn save' onClick={() => download()}></button>
    </div>
  );
};

export default Toolbar;
