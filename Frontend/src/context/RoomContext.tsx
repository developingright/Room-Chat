import { createContext,ReactNode,useContext, useState } from "react";

interface RoomContextType {
    RoomId : string | null;
    setRoomId : (roomId : string) => void;
    Username: string | null;
    setUsername: (username : string) => void;
}

export const RoomContext = createContext<RoomContextType | null >(null);

export const useRoom = () => { 
    return useContext(RoomContext);
}

export const RoomProvider = ({children} : {children : ReactNode}) =>{
    const [RoomId,setRoomId] = useState<string | null>(null);
    const [Username,setUsername] = useState<string | null>(null);
    return (
        <RoomContext.Provider value={{Username,setUsername,RoomId,setRoomId}}>
            {children}
        </RoomContext.Provider>
    )
} 