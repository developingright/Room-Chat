import { Route, Routes } from 'react-router-dom';
import './App.css';
import Room from './pages/Room';
import Chat from './pages/Chat';
import { Toaster } from './components/ui/toaster';


function App() {
 
  return (
    <>
      <Routes>
        <Route path="/chat" element={<Chat/>} />
        <Route path="/" element={<Room/>} />
      </Routes>
      <Toaster />
    </>
  )
}

export default App;
