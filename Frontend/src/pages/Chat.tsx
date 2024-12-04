import { useEffect, useState } from 'react'
// import './App.css'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { useSocket } from '@/context/SocketContext';
import { useRoom } from '@/context/RoomContext';
import { useNavigate } from 'react-router-dom';

interface Message{
  sender: string;
  message: string;
  username: string;
}

function Chat() {
  const socketContext = useSocket();
  const socket = socketContext?.socket;
  const roomContext = useRoom();
  const roomId = roomContext?.RoomId
  const [messages,setMessages] = useState<Message[]>([]);
  const [message,setMessage] = useState<string>("");
  const [connected,setConnected] = useState<string>("Connecting...");
  const navigate  = useNavigate();
  useEffect(() => {
    if (socket) {
      // Set up event handlers first
      if (socket.readyState === WebSocket.CLOSED) {
        console.error('Socket is closed');
        setConnected('Disconnected');
        return;
      }
      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setMessages(messages => [...messages, {
            sender: "notuser",
            message: data.payload?.message || data.message || event.data,
            username: data.payload?.username || data.username
          }]);
        } catch (e) {
          console.log(e);
          setMessages(messages => [...messages, {
            sender: "notuser",
            message: event.data,
            username: "System"
          }]);
        }
      };
  

      if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({
          type: "join",
          payload: { roomId , username: roomContext?.Username }
        }));
        setConnected('Connected');
      } else {
        socket.onopen = () => {
          socket.send(JSON.stringify({
            type: "join",
            payload: { roomId , username: roomContext?.Username }
          }));
        };
      }

  
      socket.onerror = (error) => {
        console.error("WebSocket error:", error);
      };
    }
    if(roomId === null){
      navigate('/');
    }
    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [socket,roomId]);

  const handleSend = () => {
    if (socket?.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({
        type: "chat",
        payload: { message,username : roomContext?.Username }
      }));
      setMessages(messages => [...messages, { sender: "user", message, username: roomContext?.Username || "Unknown" }]);
      setMessage('');
    } else {
      console.error('WebSocket is not open');
    }
  }
  return (
    <div className='h-screen bg-black flex items-center justify-center flex-col gap-4'>
      <div className='flex flex-col justify-center items-center'>
      <h1 className='text-white text-2xl'>Room - {roomId}</h1>
      <p className='text-gray-400 text-xs'>{connected}</p>
      </div>
      <div className='h-[70%] flex flex-col gap-4 relative w-[50%] border-2 border-gray-400 rounded overflow-y-scroll p-2'>
        {messages && messages.map((messages,index) => (
          messages.sender === "user" ? (
            <div key={index} className='self-end flex flex-col'>
              <div className='w-fit bg-white text-black p-2 rounded mb-2'>{messages.message}</div>
              <div className='self-end text-gray-400 text-xs capitalize'>You</div>
            </div>
            // <div key={index} className='self-end w-fit bg-white text-black p-2 rounded mb-2'>{messages.message}</div>
          ) : (
            <div key={index} className='self-start flex flex-col'>
              <div className='self-start bg-blue-700 w-fit  text-white p-2 rounded mb-2'>{messages.message}</div>
              <div className='text-gray-400 text-xs capitalize'>{messages.username}</div>
            </div>
            // <div key={index} className='self-start bg-blue-700 w-fit  text-white p-2 rounded mb-2'>{messages.message}</div>
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
