import {ipcMain} from 'electron'
import Jimp from 'jimp'
import {limitNumber,isColor,equalColors,drawCross,drawLine,getPixelsSquare} from '../../../utils/utils.ts'
import {colors} from './constants.ts'
import {lapiz} from './lapiz.ts'
import memoize from 'micro-memoize'
import Tesseract from 'tesseract.js';

const getContainerSize = (width) => {
  if(width > 1200)
    return 1140
  if(width > 992)
    return 960
  if(width > 768)
    return 720
  return 540
}
const calculateX = async ({widthStart,widthImage,y,imageCrop,lapizX,lapizY,lapizImage,image})=> {
  for(var x = widthStart;x>= widthImage;x-=14){
    const pixel = image.getPixelIndex(x,y)
    const crop = imageCrop.crop(x,y,lapizX,lapizY)
    crop.grayscale().threshold({max:200,replace:255}).invert().threshold({max:100,replace:255}).invert().autocrop()
    const distance = Jimp.distance(lapizImage, crop);
    imageCrop.bitmap.width =image.bitmap.width
    imageCrop.bitmap.height =image.bitmap.height
    imageCrop.bitmap.data =image.bitmap.data
    if(distance < 0.06){
      const pos = {
        x:Math.floor(x+(lapizX*0.5)),
        y:Math.floor(y+(lapizY*0.5))
      }
      const size = image.bitmap.width - 200 > getContainerSize(image.bitmap.width) ? getContainerSize(image.bitmap.width) : image.bitmap.width - 200
      const sizeTotal = Math.floor((image.bitmap.width - 200 - size) / 2)
      const cropLeft = imageCrop.crop(200+sizeTotal + 100 + 88,pos.y-40,160,80)
      const img = await cropLeft.grayscale().invert().threshold({max:50,replace:255}).invert().getBase64Async(Jimp.AUTO)
      const textB = await resultText(img)
      return {
        ...pos,
        image:textB,
        equal:false,
        img
      }
    }


  }
  return
}
const resultText = (screenshot) => {
  return new Promise((resolve)=>{
    Tesseract.recognize(
      Buffer.from(screenshot.split(',')[1],'base64'),
      'eng'
    ).then(({ data: { text } }) => {
      resolve(text)
    })
    .catch(e => {
      console.error(e)
      resolve('')
    })

    })
}
ipcMain.handle('find-button-wallapop',async (event,{screenshot,lastButton})=>{
  const image = await Jimp.read(Buffer.from(screenshot.split(',')[1],"base64"))
  const lapizImage = await Jimp.read(Buffer.from(lapiz,"base64"))
  const lapizX = 20
  const lapizY = 20
  const size = image.bitmap.width - 200 > getContainerSize(image.bitmap.width) ? getContainerSize(image.bitmap.width) : image.bitmap.width - 200
  const sizeTotal = Math.floor((image.bitmap.width - 200 - size) / 2)
  const widthStart = image.bitmap.width - sizeTotal - 52
  const widthImage = widthStart - (52*3)

  const heightImage = image.bitmap.height - 100 - lapizY - 26 - 40 - 16
  var imageCrop = image.cloneQuiet()
  if(lastButton){
    const cropLeft = imageCrop.crop(200 + sizeTotal + 100 + 88,lastButton.y-40,160,80)
    const img = await cropLeft.grayscale().invert().threshold({max:50,replace:255}).invert().getBase64Async(Jimp.AUTO)
    const textB = await resultText(img)
    return {
      ...lastButton,
      equal:lastButton.image == textB,
      textB,
      img
    }
  }
  else{
    for(var y = heightImage;y>= 200;y-=14){
        const res = await calculateX({widthStart,widthImage,y,imageCrop,lapizX,lapizY,lapizImage,image})
        if(res)
          return res
    }
  }

  return
})
