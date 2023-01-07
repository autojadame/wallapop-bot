import {keyboard,Key  }  from "@nut-tree/nut-js";
import { ipcMain,clipboard } from 'electron';
import {randomIntFromInterval} from '../../utils/utils.ts'



const executeWithDelay = (f) => {
  return new Promise((resolve)=>{
    setTimeout(async () => {
      await f()
      resolve(true)
    }, randomIntFromInterval(50,150));
  })

}
export const pulseKeys = async (...keys) => {
  try{
    await keyboard.pressKey(...keys)
  }
  catch(e){
    console.error(e)
  }
  await executeWithDelay(async ()=>{
    try{
      await keyboard.releaseKey(...keys)
    }
    catch(e){
      console.error(e)
    }

  });
}

const pasteText = async (text)=>{
  await clipboard.writeText(text)
  await executeWithDelay(async () => {
    await pulseKeys(
      Key.LeftControl,
      Key.V
    )
  })
  await executeWithDelay(async () => {
    await pulseKeys(Key.Enter)
  })

}

async function openProgram(name){
  return new Promise(async (resolve)=>{
    await pulseKeys(
      Key.LeftSuper,
      Key.R
    )
    setTimeout(async () => {
      await pasteText(name)
      resolve(true)
    }, 1000);
  })

}
async function maximize(){
  await pulseKeys(
    Key.LeftAlt,
    Key.Space
  )
  return new Promise((resolve)=>{
    setTimeout(async ()=>{
      await pulseKeys(
        Key.X
      )
      resolve()
    },50)
  })

}
ipcMain.handle('scroll_down_page',async () => {
  return await pulseKeys(
    Key.LeftControl,
    Key.End
  )
})
ipcMain.handle('open_browser',(event,page) => {
  return new Promise(async (resolve)=>{
    await openProgram(`chrome.exe  --new-window "${page}"`)
    setTimeout(async ()=>{
      await maximize()
      resolve(true)
    },3000)
  })
})
ipcMain.handle('open_program',(event,program) => {
  return new Promise(async (resolve)=>{
    await openProgram(`${program}.exe`)
    setTimeout(async ()=>{
      resolve(true)
    },3000)
  })
})
ipcMain.on('cerrar_ventana',()=>{
  pulseKeys(Key.LeftAlt,Key.F4)
})

ipcMain.handle('change_tab_browser',()=>{
  return new Promise((resolve)=>{
    setTimeout(async () => {
      resolve(await pulseKeys(Key.LeftControl,Key.Tab))
    }, randomIntFromInterval(1000,2000));
  })
})
ipcMain.handle('refresh_browser',()=>{
  return new Promise((resolve)=>{
    setTimeout(async () => {
      resolve(await pulseKeys(Key.F5))
    }, randomIntFromInterval(1000,2000));
  })
})
