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
export const compareToScroll = async () => {
  const screenshotA = await getShot();
  await window.electron.ipcRenderer.invoke('scroll_down_page')
  await sleep(1500)
  const screenshotB = await getShot();
  return await window.electron.ipcRenderer.invoke('equal-images',{
    screenshotA,
    screenshotB
  });
}
