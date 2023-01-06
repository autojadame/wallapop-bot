import {getResources,getScreenshot} from '../../utils/screen.ts'
export const findUpdate = async () => {
    const displays = await getResources()
    if(displays.find(a => a.source.id == "screen:0:0")){
      const {source,display} = displays.find(a => a.source.id == "screen:0:0")
      const screenshot =await getScreenshot(display.id)
      return await window.electron.ipcRenderer.invoke('find-update-wallapop',{
        screenshot
      });
    }
}
