import {DISTANCE_COLOR} from './constants'
import Color from './colors.js'

export const isValidEmail = (email) => {
  return email && email.includes('@') && email.split('@')[0].length > 2 && email.split('@')[1].length > 3 && email.split('@')[1].includes('.')
}
export const limitNumber = ({number,limit}) => {
  return Math.floor(number > limit ? limit : number)
}
export const limitBottom = (number) => {
  return Math.floor(number < 0 ? 0 : number)
}
export const drawColor = (image,pixel,color) => {
  image.bitmap.data[pixel + 0]=color.r;
  image.bitmap.data[pixel + 1]=color.g;
  image.bitmap.data[pixel + 2]=color.b;
}
export const drawCross = (image,pixel,color,x,y) => {
  for(var xx = x-3;xx<x+3;xx++){
    for(var yy = y-3;yy<y+3;yy++){
      drawColor(image,image.getPixelIndex(xx, yy),color)
    }
  }
}
export const randomIntFromInterval = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min)
}
export const isColor = ({image,color,pixel,distance})=> {
  const dist = distance ?? DISTANCE_COLOR
  var red = image.bitmap.data[pixel + 0];
  var green = image.bitmap.data[pixel + 1];
  var blue = image.bitmap.data[pixel + 2];
  const labA = Color.rgba2lab(red,green,blue)
  const labB = Color.rgba2lab(color.r,color.g,color.b)
  return Color.deltaE00(labA[0],labA[1],labA[2],labB[0],labB[1],labB[2]) <= dist
}
export const equalColors = ({image,pixelA,pixelB,distance}) => {
  const color = {
    r:image.bitmap.data[pixelA + 0],
    g:image.bitmap.data[pixelA + 1],
    b:image.bitmap.data[pixelA + 2]
  }
  return isColor({image,color,pixelB,distance})
}
export const drawLine = ({image,pointA,pointB,color}) => {
  const normalize = ({x,y}) => {
    const magnitude = Math.sqrt(x*x + y*y)
    return {
      dx:x/magnitude,
      dy:y/magnitude,
      magnitude
    }
  }
  const vectorDirection = {dx:pointB.x - pointA.x, dy:pointB.y - pointA.y}
  const {dx,dy,magnitude} = normalize({x:vectorDirection.dx,y:vectorDirection.dy})
  drawCross(image,image.getPixelIndex(pointA.x,pointA.y),color,pointA.x,pointA.y)
  drawCross(image,image.getPixelIndex(pointB.x,pointB.y),color,pointB.x,pointB.y)
  for(var i = 0;i<Math.round(magnitude);i++){
    const pixel = image.getPixelIndex(pointA.x + (i*dx),pointA.y + (i*dy))
    image.bitmap.data[pixel + 0]=color.r;
    image.bitmap.data[pixel + 1]=color.g;
    image.bitmap.data[pixel + 2]=color.b;
  }

}
export const getPixelsSquare = ({color,image,startX,startY,width,height,widthImage,heightImage,distance})=> {
  const a = image.getPixelIndex(limitBottom(startX-(width*0.5)), startY);
  const b = image.getPixelIndex(limitNumber({number:startX + (width*0.5),limit:widthImage}), startY);
  const c = image.getPixelIndex(startX,limitBottom(startY-(height*0.5)));
  const d = image.getPixelIndex(startX,limitNumber({number:startY + (height*0.5),limit:heightImage}));
  const isMX = isColor({image,color,pixel:a,distance}) ? 1 : 0
  const isPX = isColor({image,color,pixel:b,distance}) ? 1 : 0
  const isMY = isColor({image,color,pixel:c,distance}) ? 1 : 0
  const isPY = isColor({image,color,pixel:d,distance}) ? 1 : 0
  return {
    valid:isMX+isPX+isMY+isPY,
    checks:{
      a:isMX == 1,
      b:isPX == 1,
      c:isMY == 1,
      d:isPY == 1
    },
    a,
    b,
    c,
    d
  }
}
