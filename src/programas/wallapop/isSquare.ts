import {getResources,getScreenshot} from '../../utils/screen.ts'


const sleep = (ms) => {
  return new Promise((resolve)=>{
    setTimeout(()=>{
      resolve(true)
    },ms)
  })
}
const getShot = async () => {
    const displays = await getResources()
    if(displays.find(a => a.source.id == "screen:0:0")){
      const {source,display} = displays.find(a => a.source.id == "screen:0:0")
      const screenshot =await getScreenshot(display.id)
      return screenshot
    }
}
export const isSquare = async ({x,y}) => {
  const screenshot = await getShot();
  return await window.electron.ipcRenderer.invoke('check-square-wallapop',{
    screenshot,
    xButon:x,yButon:y
  });
}
