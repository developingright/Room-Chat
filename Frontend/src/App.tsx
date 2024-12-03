import { Route, Routes } from 'react-router-dom';
import './App.css';
import Room from './pages/Room';
import Chat from './pages/Chat';


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
