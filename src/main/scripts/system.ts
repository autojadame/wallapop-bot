import { ipcMain } from 'electron';
import {straightTo,Point,mouse }  from "@nut-tree/nut-js";
import Tesseract from 'tesseract.js';


ipcMain.handle('text_from_image',async (event,screenshot)=>{
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
})
