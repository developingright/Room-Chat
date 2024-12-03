import { useEffect, useState } from 'react'
// import './App.css'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { useSocket } from '@/context/SocketContext';

interface Message{
  sender: string;
  message: string;
}

function Chat() {
  const socketContext = useSocket();
  const socket = socketContext?.socket;
  const [messages,setMessages] = useState<Message[]>([]);
  const [message,setMessage] = useState<string>("");
  useEffect(() => {
    if (socket) {
      // Set up event handlers first
      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setMessages(messages => [...messages, {
            sender: "notuser",
            message: data.payload?.message || data.message || event.data
          }]);
        } catch (e) {
          setMessages(messages => [...messages, {
            sender: "notuser",
            message: event.data
          }]);
        }
      };
  

        socket.onopen = () => {
          socket.send(JSON.stringify({
            type: "join",
            payload: {
              roomId: "123"
            }
          }));
        };
      
  
      socket.onerror = (error) => {
        console.error("WebSocket error:", error);
      };
    }
  
    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [socket]);

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
    <div className='h-screen bg-black flex items-center justify-center flex-col gap-4'>
      <div className='h-[70%] flex flex-col gap-4 relative w-[50%] border-2 border-gray-400 rounded overflow-y-scroll p-2'>
        {messages && messages.map((messages,index) => (
          messages.sender === "user" ? (
            <div key={index} className='self-end w-fit bg-white text-black p-2 rounded mb-2'>{messages.message}</div>
          ) : (
            <div key={index} className='self-start bg-blue-700 w-fit  text-white p-2 rounded mb-2'>{messages.message}</div>
          )
        ))}
      </div>
      <div className='flex items-center justify-center gap-5 w-[50%]'>
        <Input placeholder='Send Message' className='text-white w-full' value={message} onChange={(e) => setMessage(e.target.value)}/>
        <Button onClick={handleSend} >Send</Button>
      </div>
    </div>
  )
}

export default Chat;
