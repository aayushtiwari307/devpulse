import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

const useSocket = (githubUserId, onEvent) => {
  const socketRef = useRef(null);

  useEffect(() => {
    if (!githubUserId) return;

    socketRef.current = io(import.meta.env.VITE_API_URL, {
      withCredentials: true,
    });

    socketRef.current.on("connect", () => {
      socketRef.current.emit("join", githubUserId);
    });

    socketRef.current.on("new_event", onEvent);

    return () => {
      socketRef.current.disconnect();
    };
  }, [githubUserId]);

  return socketRef.current;
};

export default useSocket;