import { Route, Routes } from 'react-router-dom';
import './App.css';
import Room from './pages/Room';
import Chat from './pages/Chat';
import { Toaster } from './components/ui/toaster';
import { Analytics } from "@vercel/analytics/react"

function App() {
 
  return (
    <>
      <Routes>
        <Route path="/chat" element={<Chat/>} />
        <Route path="/" element={<Room/>} />
      </Routes>
      <Toaster />
      <Analytics/>
    </>
  )
}

export default App;
