import React from 'react'
import Question from './components/Question'
import Register from './components/Register'
import './App.css'
import { Routes, Route } from 'react-router-dom'

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/question" element={<Question />} />
      </Routes>
    </div>
  )
}

export default App
