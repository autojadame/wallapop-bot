import { ipcMain,screen,desktopCapturer } from 'electron';
import Jimp from 'jimp'


let windowSource
export const initializeWindow = async (windowScreen) => {
  windowSource = windowScreen
  const displays= await getSources()
  displays.map(ss => windowScreen.webContents.send('SET_SOURCE',ss))
}

export const getScreenshot = (id) => {
  return new Promise((resolve)=>{
    ipcMain.on('screenshot'+id,(evt,screenshot)=>{
      resolve(screenshot)
    })
    windowSource.webContents.send('screenshot',id)
  })
}

export const getSources = () => {
  return new Promise((resolve)=>{
    const displays = screen.getAllDisplays()
    desktopCapturer
    .getSources({ types: ['screen'] })
    .then( async (sources) => {
        resolve(sources.map(source => {
          var display = displays.find(a => a.id  == source.display_id);
          return {display,source}
        }))
    })
    .catch(e => {
      resolve([])
    })
  })
}

ipcMain.handle('sources', async (event,words)=> {
  return await getSources()
})
