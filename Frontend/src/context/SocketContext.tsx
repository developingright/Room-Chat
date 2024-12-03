import { useContext,createContext, useState, ReactNode, useEffect } from "react";

interface SocketContextType {
    socket: WebSocket | null;
    setSocket: React.Dispatch<React.SetStateAction<WebSocket | null>>;
  }

export const SocketContext = createContext<SocketContextType| null>(null);

export const useSocket = () => {
  return useContext(SocketContext);
}

export const SocketProvider = ({children} : {children : ReactNode}) => {
    const [socket,setSocket] = useState<WebSocket | null>(null);
    useEffect(() => {   
        const ws = new WebSocket(process.env.websocket_server || '');
        setSocket(ws);
        ws.onopen = () => {
            console.log('WebSocket connection opened');
          };
      
          ws.onerror = (error) => {
            console.error('WebSocket error:', error);
          };
      
          ws.onclose = () => {
            console.log('WebSocket connection closed');
          };
        return () => {
            ws.close();
        }
    },[]);
  return (
    <SocketContext.Provider value={{ socket, setSocket }}>
      {children}
    </SocketContext.Provider>
  )
}