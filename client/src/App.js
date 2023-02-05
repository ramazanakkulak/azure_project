import React from 'react'
import {BrowserRouter,Routes,Route} from "react-router-dom"
import Login from './pages/Login'
import Register from './pages/Register'
import Cinema from './pages/Cinema'
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/register" element={<Register/>} />
        <Route exact path="/login" element={<Login/>} />
        <Route exact path="/" element={<Cinema/>} />
      </Routes>
    </BrowserRouter>
  )
}
