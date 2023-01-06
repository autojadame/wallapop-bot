import {ipcMain} from 'electron'
import Jimp from 'jimp'
import {limitNumber,isColor,equalColors,drawCross,drawLine,getPixelsSquare} from '../../../utils/utils.ts'
import {colors} from './constants.ts'
ipcMain.handle('find-button-wallapop',async (event,{screenshot})=>{
  const image = await Jimp.read(Buffer.from(screenshot.split(',')[1],"base64"))
  const widthImage = image.bitmap.width
  const heightImage = image.bitmap.height
  const ratioWidth = 20
  const ratioHeight = 8
  
  return
})
