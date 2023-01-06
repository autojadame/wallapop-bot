import React from 'react'
import styled from 'styled-components'
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './views/login'
import Loading from './views/loading'
import useRutines from '../rutines'

const AppContainer = styled.div`
  background-color: #4158D0;
  background-image: linear-gradient(43deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%);
  width:100%;
  height:100%;
`
export default function App() {
  const rutines = useRutines()
  return (
    <AppContainer>
      <Router>
        <Routes>
          <Route path="/" element={<Main rutines={rutines} />} />
        </Routes>
      </Router>
    </AppContainer>
  );
}
