import {ipcMain} from 'electron'
import Jimp from 'jimp'
import {limitNumber,isColor,equalColors,drawCross,drawLine,getPixelsSquare} from '../../../utils/utils.ts'
import {colors} from './constants.ts'
import {lapiz} from './lapiz.ts'
const sleep = (ms) => {
  return new Promise((resolve)=>{
    setTimeout(()=>{
      resolve(true)
    },ms)
  })
}

ipcMain.handle('find-update-wallapop',async (event,{screenshot})=>{
  const image = await Jimp.read(Buffer.from(screenshot.split(',')[1],"base64"))
  const lapizImage = await Jimp.read(Buffer.from(lapiz,"base64"))
  const widthImage = 0
  const widthStart = Math.floor(image.bitmap.width * 0.65)
  const incrementX = Math.floor(700*0.4*0.3)
  const heightImage = image.bitmap.height - 40 - 10 - 60 -32
    for(var y = heightImage;y>= image.bitmap.height - 300;y-=20){
      for(var x = widthStart;x>= widthImage;x-=incrementX){
        const pixel = image.getPixelIndex(x,y)

        const foundButton = getPixelsSquare({
              image,
              pixel,
              color:colors.update,
              startX:x,
              startY:y,
              width:20,
              height:20,
              widthImage:image.bitmap.width,
              heightImage:image.bitmap.height,
              distance:4
            }).valid == 4
        if(foundButton){
          return {
            x,y
          }
        }
    }
    await sleep(50)
  }
  return
})
