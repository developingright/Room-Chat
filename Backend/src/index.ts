import { WebSocket,WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });

interface User{
    socket: WebSocket;
    room:string;
    username:string;
}

let allSockets: User[] = [];

wss.on("connection",(socket)=>{

    socket.on("message",(message)=>{
        const parsedMessage = JSON.parse(message.toString());
        if(parsedMessage.type == "join" ){
            allSockets.push({
                socket,
                room:parsedMessage.payload.roomId,
                username : parsedMessage.payload.username
            })
            console.log(parsedMessage);
        }
        if(parsedMessage.type == "chat"){
            const currentUser = allSockets.find((x) => x.socket === socket);
            const currentUserRoom = currentUser?.room;
            
            allSockets.forEach((s) => {
                if (s.room === currentUserRoom && s.socket !== socket) {
                    s.socket.send(JSON.stringify({
                        type: "chat",
                        payload: {
                            message: parsedMessage.payload.message,
                            username: parsedMessage.payload.username
                        }
                    }));
                }
            });
        }
    })
   
});