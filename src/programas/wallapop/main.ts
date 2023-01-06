import {open} from './navigator.ts'
import {move,click} from '../mouse'
import {findButton} from './findButton.ts'

const sleep = (ms) => {
  return new Promise((resolve)=>{
    setTimeout(()=>{
      resolve(true)
    },ms)
  })
}

const onRutine= async () => {
  return await localStorage.getItem('rutine')
}

const startWallapop = async (setRutine,value) => {
      await open()
      await sleep(500)
      await window.electron.ipcRenderer.invoke('scroll_down',Number.MAX_VALUE)
      const but = await findButton()
      console.log(but)
      /*if(!onRutine())
        return
      if(but){
        await move(but)
        await click()
        setTimeout(() => {
          await localStorage.setItem('rutine-wallapop',time)
          window.electron.ipcRenderer.sendMessage('cerrar_ventana')
        }, 5000);
      }
      else{
        readyForStart(anydesk,setRutine,onRutine,initial,tries+1)
      }*/


}
