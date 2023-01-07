import {open} from './navigator.ts'
import {move,click} from '../mouse'
import {findButton} from './findButton.ts'
import {findUpdate} from './findUpdate.ts'
import {isSquare} from './isSquare.ts'
import {compareToScroll} from './compareToScroll.ts'

const sleep = (ms) => {
  return new Promise((resolve)=>{
    setTimeout(()=>{
      resolve(true)
    },ms)
  })
}

const onRutine= async () => {
  return await localStorage.getItem('rutine') == "1"
}

export const startWallapop = async (setRutine,value) => {
      await sleep(2500)
      while(true){
          const areEqualScrolls = await compareToScroll();
          if(areEqualScrolls)
            break;
      }
      if(!(await onRutine()))
        return

      var but = await findButton(value?.button)
      if(but){
        if(but.equal){
          setRutine(false)
          return;
        }

        if(!(await onRutine()))
          return
        var changes = false
        while(true){
          const square = await isSquare(but)
          if(!(await onRutine()))
            return
          if(square){
            await window.electron.ipcRenderer.invoke('scroll_up',118)
            await sleep(1500)
            changes = true
          }
          else{
            if(changes){
              but = await findButton(value?.button,{
                xPass:but.x,
                yPass:but.y
              })
              if(but.equal){
                setRutine(false)
                return;
              }
            }
            break;
          }
        }
        await move(but)

        await click()
        if(!(await onRutine()))
          return
        await sleep(2500)
        await window.electron.ipcRenderer.invoke('scroll_down_page')
        await sleep(1500)
        if(!(await onRutine()))
          return
        const butActualizr = value?.update ?? await findUpdate()
        if(!(await onRutine()))
          return
        if(butActualizr) {
          await move(butActualizr)
          if(!(await onRutine()))
            return
          await click()
          if(!(await onRutine()))
            return
          await sleep(2500)
          if(!(await onRutine()))
            return
          startWallapop(setRutine,{
            button:but,
            update:butActualizr
          })
        }
        else{
          startWallapop(setRutine,{
            button:but
          })
        }

      }
      else{
        console.error("Couldn't find button!")
        setRutine(false)
      }



}
