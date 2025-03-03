import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import type { RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

type Stream = Database['public']['Tables']['streams']['Row'];

export function StreamPlayer() {
  const { username } = useParams();
  const [streamUrl, setStreamUrl] = useState<string | null>(null);
  const [isLive, setIsLive] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;

  // Fetch user profile and subscribe to stream updates
  useEffect(() => {
    const fetchProfileAndStream = async () => {
      try {
        setIsLoading(true);
        console.log("Fetching profile for username:", username);

        // First get the user's profile
        const { data: profiles, error: profileError } = await supabase
          .from('profiles')
          .select('id')
          .eq('username', username);

        if (profileError) {
          console.error("Error fetching profile:", profileError);
          toast({
            title: "Ошибка",
            description: "Не удалось загрузить профиль стримера",
            variant: "destructive",
          });
          return;
        }

        const profile = profiles?.[0];
        
        if (!profile) {
          console.error("Profile not found for username:", username);
          toast({
            title: "Ошибка",
            description: "Стример не найден",
            variant: "destructive",
          });
          return;
        }

        console.log("Found profile:", profile);
        setUserId(profile.id);

        // Then fetch their active stream
        const { data: streams, error: streamError } = await supabase
          .from('streams')
          .select('*')
          .eq('user_id', profile.id)
          .eq('status', 'live')
          .order('created_at', { ascending: false })
          .limit(1);

        if (streamError) {
          console.error("Error fetching stream:", streamError);
          toast({
            title: "Ошибка",
            description: "Не удалось загрузить стрим",
            variant: "destructive",
          });
          return;
        }

        const mostRecentStream = streams?.[0];
        
        if (mostRecentStream && mostRecentStream.status === 'live') {
          console.log("Found active stream:", mostRecentStream);
          if (mostRecentStream.stream_url) {
            console.log("Setting stream URL:", mostRecentStream.stream_url);
            setStreamUrl(mostRecentStream.stream_url);
            setIsLive(true);
            setRetryCount(0);
          } else {
            console.error("Stream URL is null for active stream");
            setStreamUrl(null);
            setIsLive(false);
          }
        } else {
          console.log("No active stream found");
          setStreamUrl(null);
          setIsLive(false);
        }
      } catch (error) {
        console.error("Error in fetchProfileAndStream:", error);
        toast({
          title: "Ошибка",
          description: "Не удалось загрузить стрим",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileAndStream();
  }, [username]);

  // Subscribe to stream updates once we have the user ID
  useEffect(() => {
    if (!userId) return;

    console.log("Setting up realtime subscription for user:", userId);

    const channel = supabase
      .channel('stream-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'streams',
          filter: `user_id=eq.${userId}`,
        },
        (payload: RealtimePostgresChangesPayload<Stream>) => {
          console.log("Received stream update:", payload);
          
          if (payload.new && 'status' in payload.new) {
            if (payload.new.status === 'live' && payload.new.stream_url) {
              console.log("Stream went live:", payload.new);
              setStreamUrl(payload.new.stream_url);
              setIsLive(true);
              setRetryCount(0);
              toast({
                title: "Трансляция началась",
                description: "Стример начал трансляцию",
              });
            } else {
              console.log("Stream ended or not live");
              setStreamUrl(null);
              setIsLive(false);
              toast({
                title: "Трансляция закончилась",
                description: "Стример завершил трансляцию",
              });
            }
          }
        }
      )
      .subscribe();

    return () => {
      console.log("Cleaning up realtime subscription");
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const handleVideoError = async (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    console.error("Video error:", e);
    const videoElement = e.currentTarget;
    console.log("Video element state:", {
      readyState: videoElement.readyState,
      networkState: videoElement.networkState,
      error: videoElement.error
    });

    if (retryCount < MAX_RETRIES) {
      console.log(`Attempting retry ${retryCount + 1} of ${MAX_RETRIES}`);
      setRetryCount(prev => prev + 1);
      videoElement.load();
    } else {
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить видео после нескольких попыток",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="aspect-video bg-card rounded-lg border-2 border-[#9b87f5] overflow-hidden">
        <div className="w-full h-full bg-black/50 flex items-center justify-center">
          <p className="text-white">Загрузка трансляции...</p>
        </div>
      </div>
    );
  }

  if (!isLive) {
    return (
      <div className="aspect-video bg-card rounded-lg border-2 border-[#9b87f5] overflow-hidden">
        <div className="w-full h-full bg-black/50 flex items-center justify-center">
          <p className="text-white">Трансляция не активна</p>
        </div>
      </div>
    );
  }

  return (
    <div className="aspect-video bg-card rounded-lg border-2 border-[#9b87f5] overflow-hidden">
      {streamUrl ? (
        <video
          key={streamUrl}
          src={streamUrl}
          className="w-full h-full object-cover"
          autoPlay
          playsInline
          controls
          onError={handleVideoError}
        />
      ) : (
        <div className="w-full h-full bg-black/50 flex items-center justify-center">
          <p className="text-white">Загрузка трансляции...</p>
        </div>
      )}
    </div>
  );
}