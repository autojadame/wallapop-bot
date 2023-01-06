import React,{useEffect,useState} from 'react'
import styled from 'styled-components'
import Button from '../component'
import {startWallapop} from '../../programas/wallapop/main.ts'

const Container = styled.div`
  width:100%;
  height:100%;
  display:flex;
  justify-content:center;
  align-items:center;
`



const Main = () => {

  const [onRutine,setOnRutine] = useState(false)
  const rutineSet = (val) => {
    setOnRutine(val)
    localStorage.setItem('rutine',!val)
  }
  useEffect(()=>{
    localStorage.setItem('rutine',onRutine)
  },[onRutine])
  return (
    <Container>
      <Button disabled={onRutine} onClick={()=>{
        if(!onRutine){
          startWallapop(rutineSet)
        }
        rutineSet(!onRutine)
      }} title={onRutine ? "End" : "Start"} />
    </Container>
  )
}
export default Loading
