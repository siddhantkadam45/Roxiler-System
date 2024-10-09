import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Statistics from './Routes/Statistics'
import Transaction from './Routes/Transaction'
import Barchart from './Routes/Barchart'
export default function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path = '/barchart' element ={<Barchart />} />
          <Route path = '/statis' element ={<Statistics />} />
          <Route path = '/' element ={<Transaction />} />
        </Routes>
      </BrowserRouter>

    </>
  )
}


