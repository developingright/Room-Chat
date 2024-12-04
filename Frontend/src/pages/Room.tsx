import { Input } from "@/components/ui/input";
import { useRoom } from "@/context/RoomContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "@/context/SocketContext";
import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

const generateRoomCode = () => {
  return Math.random().toString(36).substring(2, 7).toUpperCase();
};

const Room = () => {
  const roomContext = useRoom();
  const roomId = roomContext?.RoomId;
  const Username = roomContext?.Username;
  const setRoomId = roomContext?.setRoomId;
  const setUsername = roomContext?.setUsername;
  const [connected, setConnected] = useState<string>("Connecting...");
  const socketContext = useSocket();
  const setSocket = socketContext?.setSocket;
  const [roomCode, setRoomCode] = useState<string>("");
  const navigate = useNavigate();
  const { toast } = useToast();
  const handleJoinRoom = () => {
    if (roomId && Username) {
      navigate("/chat");
    }
  };

  const Clipboard = () => {
    toast({
      title: "Copied",
      description: "Room code copied to clipboard",
    });
    navigator.clipboard.writeText(roomCode);
  };

  const handleRoomIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().slice(0, 5);
    setRoomId?.(value);
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.slice(0, 10);
    setUsername?.(value);
  };

  useEffect(() => {
    const ws = new WebSocket(process.env.websocket_server || "");
    if (setSocket) {
      setSocket(ws);
      if (ws.readyState === WebSocket.CLOSED) {
        console.error("Socket is closed");
        setConnected("Disconnected");
        return;
      }
      ws.onopen = () => {
        console.log("WebSocket connection opened");
        setConnected("Connected");
      };
    }
  }, []);
  return (
    <div className="h-screen flex  w-full bg-black items-center justify-center flex-col">
      <div className="w-[40%] h-[80%] flex flex-col gap-4 items-center justify-center">
        <motion.h1
          className="text-white text-3xl mb-10 font-bold"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.08,
              },
            },
          }}
        >
          {Array.from("Room Chat").map((letter, index) => (
            <motion.span
              key={index}
              variants={{
                hidden: {
                  y: 20,
                  opacity: 0,
                },
                visible: {
                  y: 0,
                  opacity: 1,
                  transition: {
                    type: "spring",
                    damping: 12,
                    stiffness: 200,
                  },
                },
              }}
              style={{ display: "inline-block" }}
            >
              {letter === " " ? "\u00A0" : letter}
            </motion.span>
          ))}
          <motion.span
            variants={{
              hidden: { scale: 0, opacity: 0 },
              visible: {
                scale: 1,
                opacity: 1,
                transition: {
                  type: "spring",
                  damping: 12,
                  stiffness: 200,
                  delay: 0.5,
                },
              },
            }}
          >
            {" 💬"}
          </motion.span>
        </motion.h1>
        <div className="w-full flex flex-col gap-2">
          <h1 className="text-gray-400 text-sm">
            Status:{" "}
            <span
              className={`${
                connected == "Connected" ? "text-green-400" : "text-red-600"
              }`}
            >
              {connected}
            </span>
          </h1>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20,
            }}
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileFocus={{ scale: 1.02 }}
              className="relative overflow-hidden"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                animate={{
                  x: ["-200%", "200%"],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
              <Input
                className="text-white placeholder:text-gray-400 backdrop-blur-sm bg-black/30 border-gray-700 focus:border-white transition-colors"
                value={roomId ?? ""}
                maxLength={5}
                placeholder="Enter Room ID (5 characters)"
                onChange={handleRoomIdChange}
              />
            </motion.div>
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 20,
            delay: 0.2,
          }}
          className="w-full"
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileFocus={{ scale: 1.02 }}
            className="relative overflow-hidden"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
              animate={{
                x: ["-200%", "200%"],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear",
              }}
            />
            <Input
              className="text-white placeholder:text-gray-400 backdrop-blur-sm bg-black/30 border-gray-700 focus:border-white transition-colors"
              value={Username ?? ""}
              maxLength={10}
              placeholder="Enter Username (max 10 characters)"
              onChange={handleUsernameChange}
            />
          </motion.div>
        </motion.div>
        <motion.button
          initial={{ scale: 1 }}
          whileHover={{ scale: 1.01 }}
          className="bg-white text-black p-2 rounded w-full  transition-all duration-300"
          onClick={handleJoinRoom}
        >
          Join Room
        </motion.button>
        <div className="flex w-full items-center gap-4">
          <span className="border-2 border-gray-700 flex-1 h-1 rounded"></span>
          <span className="text-white">OR</span>
          <span className="border-2 border-gray-700 w-[33%] flex-1 rounded"></span>
        </div>
        <motion.button
          initial={{ scale: 1 }}
          whileHover={{ scale: 1.01 }}
          className="bg-white text-black p-2 rounded w-full transition-all duration-300"
          onClick={() => {
            const code = generateRoomCode();
            setRoomCode(code);
          }}
        >
          Create Room
        </motion.button>
        {roomCode && (
          <>
            <p className="text-gray-400 text-xs">
              Here is a unique room code, send it to other to join
            </p>
            <div className="flex items-center justify-center gap-5">
              <h3 className="text-white">{roomCode}</h3>
              <Copy
                className="text-white cursor-pointer"
                size={15}
                onClick={() => Clipboard()}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Room;
