import {straightTo,Point,mouse,Button  }  from "@nut-tree/nut-js";
import { ipcMain } from 'electron';
import { path } from "ghost-cursor"


mouse.mouseSpeed = 100

export const move = async (point) => {
  const currentPos = await mouse.getPosition()
  const route = path(currentPos, point)
  for(let {x,y} of route){
    const p = new Point(x,y)
    await mouse.move(straightTo(p))
  }
  return true
}

ipcMain.handle('move_mouse',async (event,point)=>{
  try{
    await move(point)
  }
  catch(e){

  }
  return
})

ipcMain.handle('mouse_click',async ()=>{
    await mouse.click(Button.LEFT)
})
ipcMain.handle('scroll_down',async (event,amount = 150) => {
    await mouse.scrollDown(amount)
})
ipcMain.handle('scroll_up',async (event,amount = 150) => {
    await mouse.scrollUp(amount)
})
