import { Route, Routes } from 'react-router-dom';
import './App.css';
import Chat from './pages/chat';
import Room from './pages/Room';

function App() {
 
  return (
    <>
      <Routes>
        <Route path="/chat" element={<Chat/>} />
        <Route path="/" element={<Room/>} />
      </Routes>
    </>
  )
}

export default App;
