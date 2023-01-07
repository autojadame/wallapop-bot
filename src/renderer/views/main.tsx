import React,{useEffect,useState,useRef} from 'react'
import styled from 'styled-components'
import Button from '../component/button'
import {startWallapop} from '../../programas/wallapop/main.ts'

const Container = styled.div`
  width:100%;
  height:100%;
  display:flex;
  justify-content:center;
  align-items:center;
`
const VersionContainer = styled.div`
  color:#ffffff;
  opacity:0.7;
  position:fixed;
  bottom:5px;
  right:5px;
  font-size:13px;
  font-weight: lighter;
`


const LIMIT = 10
const Main = () => {

  const [onRutine,setOnRutine] = useState(false)
  const seconds = useRef(LIMIT)
  const [version,setVersion] = useState("")
  const getVersion = async () => {
      setVersion(await window.electron.ipcRenderer.invoke('version'))
    }
  const [secondsTt,setSecondsTT] = useState(new Date().getTime())
  const counter = () => {
    setTimeout(()=>{
      if(seconds.current > 0){
        seconds.current = seconds.current -1
        setSecondsTT(new Date().getTime())
        counter()
      }
      else{
        setOnRutine(true)
        startWallapop(rutineSet)
        setSecondsTT(new Date().getTime())
        localStorage.setItem('rutine',"1")
        seconds.current = LIMIT
      }
    },1000)
  }
  const rutineSet = (val) => {
    console.log(val)
    if(val){
      seconds.current = seconds.current -1
      setSecondsTT(new Date().getTime())
      counter()
    }
    else{
      setOnRutine(val)
      localStorage.setItem('rutine',val ? "1" : "0")
    }

  }
  useEffect(()=>{
    getVersion()
    localStorage.setItem('rutine',"0")
  },[])
  return (
    <Container>
      <Button disabled={seconds.current < LIMIT && seconds.current >= 0 } onClick={async ()=>{
        const newVal = await localStorage.getItem('rutine')
        rutineSet(newVal == "1" ? false : true)
      }} title={seconds.current < LIMIT && seconds.current >= 0 ? `Prepare it! Click on Wallapop ${seconds.current}...` : onRutine ? "End" : "Start"} />
      <VersionContainer>
        {version}
        </VersionContainer>
    </Container>
  )
}
export default Main
