import { Input } from "@/components/ui/input";
import { useRoom } from "@/context/RoomContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {useSocket} from '@/context/SocketContext';

const Room = () =>{
    const roomContext = useRoom();
    const roomId = roomContext?.RoomId;
    const Username = roomContext?.Username;
    const setRoomId = roomContext?.setRoomId;
    const setUsername = roomContext?.setUsername;
    const [connected,setConnected] = useState<string>("Connecting...");
    const socketContext = useSocket();
    const setSocket = socketContext?.setSocket;

    const navigate = useNavigate();

    const handleJoinRoom = () => {
        if(roomId && Username){
            navigate('/chat');
        }
    }

    useEffect(()=>{
        const ws = new WebSocket(process.env.websocket_server || '');
        if (setSocket) {
            setSocket(ws);
            if (ws.readyState === WebSocket.CLOSED) {
                console.error('Socket is closed');
                setConnected('Disconnected');
                return;
            }
            ws.onopen = () => {
                console.log('WebSocket connection opened');
                setConnected('Connected');
            };
        }
    },[]);
    return(
        <div className="h-screen flex  w-full bg-black items-center justify-center">
            <div className="w-[40%] h-[80%] flex flex-col gap-4 items-center justify-center">
            <div className="w-full flex flex-col gap-2">
                <h1 className="text-gray-400 text-sm">Status: {connected}</h1>
            <Input className="text-white" value={roomId ?? ''} placeholder="Enter Room ID" onChange={(e) => setRoomId?.(e.target.value)}/>
            </div>
            <Input className="text-white" value={Username ?? ''} placeholder="Enter User name" onChange={(e) => setUsername?.(e.target.value)}/>
            <button className="bg-white text-black p-2 rounded w-full hover:bg-slate-200 transition-all duration-300" onClick={handleJoinRoom}>Join Room</button>
            <div className="flex w-full items-center gap-4">
                <span className="border-2 border-gray-700 flex-1 h-1 rounded"></span>
                <span className="text-white">OR</span>
                <span className="border-2 border-gray-700 w-[33%] flex-1 rounded"></span>
            </div>
            <button className="bg-white text-black p-2 rounded w-full hover:bg-slate-200 transition-all duration-300" >Create Room</button>
            </div>
        </div>
    )
}

export default Room;