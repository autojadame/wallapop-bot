import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  background:transparent;
  border:1px solid white;
  padding:15px;
  width:100%;
  border-radius:15px;
  color:white;
  box-sizing: border-box;
  display:flex;
  justify-content:center;
  align-items:center;
  letter-spacing:4px;
  cursor:${props => props.disabled ? "default" : "pointer"};
  transition:0.4s;
  pointer-events:${props => props.disabled ? "none" : "all"};
  opacity:${props => props.disabled ? 0.5 : 1};
  &:hover{
    background:#eeeeee22;
  }

`

const Button = ({title,onClick,disabled}) => {
  return (
    <Container disabled={disabled} onClick={()=>{
      if(!disabled)
        onClick()
      }}>
      {title}
    </Container>
  )
}
export default Button
