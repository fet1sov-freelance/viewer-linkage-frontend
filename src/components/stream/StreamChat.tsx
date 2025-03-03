import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

interface ChatMessage {
  id: string;
  username: string;
  message: string;
  timestamp: Date;
}

interface StreamChatProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
}

export function StreamChat({ messages = [], onSendMessage }: StreamChatProps) {
  const [newMessage, setNewMessage] = useState("");
  const { t } = useTranslation();

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage("");
    }
  };

  return (
    <div className="bg-card rounded-lg p-6 relative h-[500px] flex flex-col border-2 border-[#9b87f5]">
      <h3 className="text-lg font-semibold mb-4 flex items-center justify-center gap-2">
        {t('stream.chat.title')}
      </h3>
      <div className="space-y-4 flex-1 overflow-y-auto mb-4">
        {messages?.map((msg) => (
          <div key={msg.id} className="bg-secondary p-3 rounded-lg">
            <div className="flex justify-between items-center mb-1">
              <span className="font-semibold">{msg.username}</span>
              <span className="text-xs text-muted-foreground">
                {msg.timestamp.toLocaleTimeString()}
              </span>
            </div>
            <p className="text-sm">{msg.message}</p>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder={t('stream.chat.placeholder')}
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
        />
        <Button onClick={handleSendMessage} size="icon">
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}