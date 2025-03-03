import { Header } from "@/components/Header";
import { useParams } from "react-router-dom";
import { StreamChat } from "@/components/stream/StreamChat";
import { StreamActions } from "@/components/stream/StreamActions";
import { StreamInfo } from "@/components/stream/StreamInfo";
import { StreamPlayer } from "@/components/stream/StreamPlayer";
import { useStreamChat } from "@/hooks/useStreamChat";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const UserStream = () => {
  const { username } = useParams();
  const { chatMessages, handleSendMessage } = useStreamChat();

  const { data: streamData } = useQuery({
    queryKey: ['stream', username],
    queryFn: async () => {
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', username)
        .single();

      if (!profiles) return null;

      const { data: stream } = await supabase
        .from('streams')
        .select('*')
        .eq('user_id', profiles.id)
        .eq('status', 'live')
        .single();

      return stream;
    },
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <StreamInfo 
              username={username || ""} 
              viewerCount={1234} 
              followerCount={5678}
              title={streamData?.title}
            />
            <StreamPlayer />
          </div>
          <div className="space-y-6">
            <StreamChat 
              messages={chatMessages}
              onSendMessage={handleSendMessage}
            />
            <StreamActions />
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserStream;