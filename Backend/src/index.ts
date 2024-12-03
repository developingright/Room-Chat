import { WebSocket,WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });

interface User{
    socket: WebSocket;
    room:string;
}

let allSockets: User[] = [];

wss.on("connection",(socket)=>{

    socket.on("message",(message)=>{
        const parsedMessage = JSON.parse(message.toString());
        if(parsedMessage.type == "join" ){
            allSockets.push({
                socket,
                room:parsedMessage.payload.roomId
            })
            console.log(parsedMessage);
        }
        if(parsedMessage.type == "chat"){
            const currentUserRoom = allSockets.find((x)=> x.socket === socket )?.room;
            allSockets.forEach((s)=> s.room == currentUserRoom && s.socket != socket &&  s.socket.send(parsedMessage.payload.message));
        }
    })
   
});