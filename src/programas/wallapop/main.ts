import {open} from './navigator.ts'
import {move,click} from '../mouse'
import {findButton} from './findButton.ts'
import {findUpdate} from './findUpdate.ts'

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
      await window.electron.ipcRenderer.invoke('scroll_down_page')
      await sleep(500)
      await window.electron.ipcRenderer.invoke('scroll_down_page')
      await sleep(500)
      if(!(await onRutine()))
        return
      const but = await findButton(value?.button)
      if(but){
        console.log(but)
        if(but.equal){
          setRutine(false)
          return;
        }
        if(!(await onRutine()))
          return
        await move(but)
        if(!(await onRutine()))
          return
        await click()
        if(!(await onRutine()))
          return
        await sleep(2500)
        if(!(await onRutine()))
          return
        await window.electron.ipcRenderer.invoke('scroll_down_page')
        await sleep(500)
        await window.electron.ipcRenderer.invoke('scroll_down_page')
        await sleep(500)
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
