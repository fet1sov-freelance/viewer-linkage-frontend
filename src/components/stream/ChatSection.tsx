import { StreamChat } from "./StreamChat";
import { ChatSettings } from "./ChatSettings";
import { ChatMessage } from "@/hooks/useStreamChat";

interface ChatSectionProps {
  messages: ChatMessage[];
  chatDelay: string;
  onSendMessage: (message: string) => void;
  onChatDelayChange: (delay: string) => void;
}

export function ChatSection({
  messages = [],
  chatDelay,
  onSendMessage,
  onChatDelayChange,
}: ChatSectionProps) {
  return (
    <div className="lg:col-span-1 space-y-6">
      <StreamChat 
        messages={messages}
        onSendMessage={onSendMessage}
      />
      <ChatSettings 
        chatDelay={chatDelay}
        onChatDelayChange={onChatDelayChange}
      />
    </div>
  );
}