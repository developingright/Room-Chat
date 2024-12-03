

import { useEffect, useState } from 'react'
import './App.css'
import { Button } from './components/ui/button'
import { Input } from './components/ui/input'

interface Message{
  sender: string;
  message: string;
}

function App() {
  const [socket, setSocket] = useState<WebSocket>();
  const [messages,setMessages] = useState<Message[]>([]);
  const [message,setMessage] = useState<string>("");
  useEffect(() => {
    const ws = new WebSocket(process.env.websocket_server || '');
    setSocket(ws);

    ws.onopen = () =>{
      ws.send(JSON.stringify({
        type: "join",
        payload: {
          roomId: "123"
        }
      }));
    }
    ws.onmessage = (message) => {
      setMessages(messages => [...messages,{sender:"notuser",message:message.data}]);
    }

    return () => {
      ws.close();
    }

  }, []);

  const handleSend = () => {
    socket?.send(
      JSON.stringify({
        type: "chat",
        payload: {
          message: message
        }
      })
  );
  setMessages(messages => [...messages,{sender:"user",message:message}]);
  setMessage('');
  }
  return (
    <div className='h-screen bg-black flex items-center justify-center flex-col'>
      <div className='h-[70%] flex flex-col gap-4 relative w-[50%] border-2 border-gray-400 rounded overflow-y-scroll p-2'>
        {messages && messages.map((messages,index) => (
          messages.sender === "user" ? (
            <div key={index} className='self-end w-fit bg-white text-black p-2 rounded mb-2'>{messages.message}</div>
          ) : (
            <div key={index} className='self-start bg-blue-700 w-fit  text-white p-2 rounded mb-2'>{messages.message}</div>
          )
        ))}
      </div>
      <div className='flex items-center justify-center gap-5'>
        <Input placeholder='Send Message' className='text-white' value={message} onChange={(e) => setMessage(e.target.value)}/>
        <Button onClick={handleSend} >Send</Button>
      </div>
    </div>
  )
}

export default App
