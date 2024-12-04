import { useEffect, useRef, useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useSocket } from "@/context/SocketContext";
import { useRoom } from "@/context/RoomContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { motion } from "framer-motion";
import { Copy, Send } from "lucide-react";


interface Message {
  sender: string;
  message: string;
  username: string;
}

function Chat() {
  const socketContext = useSocket();
  const socket = socketContext?.socket;
  const roomContext = useRoom();
  const { toast } = useToast();
  const roomId = roomContext?.RoomId;
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState<string>("");
  const [connected, setConnected] = useState<string>("Connecting...");
  const navigate = useNavigate();
  const messageRef = useRef<HTMLDivElement>(null);

  const Clipboard = () => {
    toast({
      title: "Copied",
      description: "Room code copied to clipboard",
    });
    navigator.clipboard.writeText(roomId || "");
  };

  useEffect(() => {
    if (socket) {
      if (socket.readyState === WebSocket.CLOSED) {
        console.error("Socket is closed");
        setConnected("Disconnected");
        toast({
          title: "Disconnected",
          variant: "destructive",
          description: "Socket is closed, Please try again",
          action: (
            <ToastAction altText="Try again" onClick={() => navigate("/")}>
              Try again
            </ToastAction>
          ),
        });
        return;
      }
      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setMessages((messages) => [
            ...messages,
            {
              sender: "notuser",
              message: data.payload?.message || data.message || event.data,
              username: data.payload?.username || data.username,
            },
          ]);
        } catch (e) {
          console.log(e);
          setMessages((messages) => [
            ...messages,
            {
              sender: "notuser",
              message: event.data,
              username: "System",
            },
          ]);
        }
      };
      if (socket.readyState!==WebSocket.OPEN) {
        setConnected("Disconnected");
        toast({
          title: "Disconnected",
          variant: "destructive",
          description: "Socket is closed, Please try again",
          action: (
            <ToastAction altText="Try again" onClick={() => navigate("/")}>
              Try again
            </ToastAction>
          ),
        });
      }
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(
          JSON.stringify({
            type: "join",
            payload: { roomId, username: roomContext?.Username },
          })
        );
        setConnected("Connected");
      } else {
        socket.onopen = () => {
          socket.send(
            JSON.stringify({
              type: "join",
              payload: { roomId, username: roomContext?.Username },
            })
          );
        };
      }

      socket.onerror = (error) => {
        console.error("WebSocket error:", error);
      };
    }
    if (roomId === null) {
      navigate("/");
    }
    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [socket, roomId]);

  const handleSend = () => {
    if (socket?.readyState === WebSocket.OPEN) {
      socket.send(
        JSON.stringify({
          type: "chat",
          payload: { message, username: roomContext?.Username },
        })
      );
      setMessages((messages) => [
        ...messages,
        {
          sender: "user",
          message,
          username: roomContext?.Username || "Unknown",
        },
      ]);
      setMessage("");
    } else {
      console.error("WebSocket is not open");
    }
  };

  useEffect(() => {
    if (messageRef.current) {
      messageRef.current.scrollTo({
        top: messageRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);
  return (
    <div className="h-screen bg-black flex items-center justify-center flex-col gap-4">
      <div className="flex flex-col justify-center items-center">
        <div className="flex gap-5 items-center">
        <h1 className="text-white text-2xl">Room - {roomId}</h1>
        <Copy className="text-white cursor-pointer" size={15} onClick={Clipboard}/>
        </div>
        <p className="text-gray-400 text-xs">
          Status :{" "}
          <span
            className={`${
              connected === "Connected" ? "text-green-400" : "text-red-600"
            }`}
          >
            {connected}
          </span>
        </p>
      </div>
      <div
        ref={messageRef}
        className="h-[70%] flex flex-col gap-4 relative w-[50%] border-2 border-gray-400 rounded overflow-y-scroll p-2"
      >
        {messages &&
          messages.map((messages, index) =>
            messages.sender === "user" ? (
              <motion.div
                key={index}
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                // ref={messageRef}
                transition={{
                  type: "spring",
                  damping: 20,
                  stiffness: 300,
                  delay: index * 0.01,
                }}
                className="self-end flex flex-col"
              >
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="w-fit bg-white text-black p-2 rounded mb-2"
                >
                  {messages.message}
                </motion.div>
                <motion.div className="self-end text-gray-400 text-xs capitalize">
                  You
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                key={index}
                // ref={messageRef}
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{
                  type: "spring",
                  damping: 20,
                  stiffness: 300,
                  delay: index * 0.01,
                }}
                className="self-start flex flex-col"
              >
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="self-start bg-blue-700 w-fit text-white p-2 rounded mb-2"
                >
                  {messages.message}
                </motion.div>
                <motion.div className="self-start text-gray-400 text-xs capitalize">
                  {messages.username}
                </motion.div>
              </motion.div>
            )
          )}
      </div>
      <div className="flex items-center justify-center gap-5 w-[50%] p-2">
        <motion.div
          className="w-full relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 20,
          }}
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
          <motion.div>
            <Input
              placeholder="Send Message"
              className="text-white w-full backdrop-blur-sm bg-black/30 border-gray-700 focus:border-white transition-colors"
              value={message}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              onChange={(e) => setMessage(e.target.value)}
            />
          </motion.div>
        </motion.div>
        <Button
          className="hover:scale-110 transition-transform duration-300"
          onClick={handleSend}
        >
          <Send />
        </Button>
      </div>
    </div>
  );
}

export default Chat;
