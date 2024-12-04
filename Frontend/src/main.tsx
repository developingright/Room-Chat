import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {BrowserRouter} from 'react-router-dom'
import { SocketProvider } from './context/SocketContext.tsx'
import { RoomProvider } from './context/RoomContext.tsx'

createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
      <SocketProvider>
        <RoomProvider>
          <App />
        </RoomProvider>
      </SocketProvider>
    </BrowserRouter>,
)
