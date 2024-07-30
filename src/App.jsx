import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Chat from './Chat'
import AllChats from './AllChats'

function App() {
  return (
      <Routes>
        <Route path="/" element={<AllChats />}/>
        <Route path="/chat/:id" element={<Chat />} />
      </Routes>
  )
}

export default App