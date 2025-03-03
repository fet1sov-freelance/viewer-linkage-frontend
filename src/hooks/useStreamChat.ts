import { useState } from "react";

export interface ChatMessage {
  id: string;
  username: string;
  message: string;
  timestamp: Date;
}

export const useStreamChat = () => {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatDelay, setChatDelay] = useState("0");

  const handleSendMessage = (message: string) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      username: "Стример",
      message,
      timestamp: new Date(),
    };
    setChatMessages(prev => [...(prev || []), newMessage]);
  };

  return {
    chatMessages: chatMessages || [],
    chatDelay,
    setChatDelay,
    handleSendMessage
  };
};