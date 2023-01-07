import {ipcMain} from 'electron'
import Jimp from 'jimp'
import {limitNumber,isColor,equalColors,drawCross,drawLine,getPixelsSquare} from '../../../utils/utils.ts'
import {colors} from './constants.ts'
import {lapiz} from './lapiz.ts'

ipcMain.handle('check-square-wallapop',async (event,{screenshot,xButon,yButon})=>{
  const image = await Jimp.read(Buffer.from(screenshot.split(',')[1],"base64"))
  const pixel = image.getPixelIndex(xButon-48,yButon)
  const checkIcon = getPixelsSquare({
    color:colors.reservado,
    image,
    startX:xButon-48,
    startY:yButon,width:20,height:20,widthImage:image.bitmap.width,heightImage:image.bitmap.height,distance:6})
  return checkIcon.valid >= 1
})
