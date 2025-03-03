import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { StreamSection } from "@/components/stream/StreamSection";
import { ChatSection } from "@/components/stream/ChatSection";
import { useStreamSetup } from "@/hooks/useStreamSetup";
import { useStreamChat } from "@/hooks/useStreamChat";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Stream = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [streamTitle, setStreamTitle] = useState(t('stream.defaultTitle'));
  const {
    isWebcamEnabled,
    isMicEnabled,
    isScreenShareEnabled,
    isStreaming,
    setIsStreaming,
    videoRef,
    screenRef,
    toggleWebcam,
    toggleMic,
    toggleScreenShare,
    streamRef,
    screenStreamRef
  } = useStreamSetup();

  const {
    chatMessages,
    chatDelay,
    setChatDelay,
    handleSendMessage
  } = useStreamChat();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/');
        toast({
          title: t("stream.error.start"),
          description: t("stream.auth.required"),
          variant: "destructive",
        });
      } else {
        toast({
          title: t("stream.success.start"),
          description: t("stream.success.start"),
        });
      }
    };
    checkAuth();
  }, [navigate, t]);

  const toggleStreaming = async () => {
    if (!isStreaming) {
      if (!streamRef.current && !screenStreamRef.current) {
        toast({
          title: t("stream.error.start"),
          description: t("stream.error.start"),
          variant: "destructive",
        });
        return;
      }

      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          toast({
            title: t("stream.error.start"),
            description: t("stream.auth.required"),
            variant: "destructive",
          });
          return;
        }

        const { error } = await supabase
          .from('streams')
          .insert({
            user_id: session.user.id,
            status: 'live',
            title: streamTitle,
            stream_url: window.location.href,
            thumbnail_url: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b',
          });

        if (error) throw error;

        setIsStreaming(true);
        toast({
          title: t("stream.success.start"),
          description: t("stream.success.start"),
        });
      } catch (error) {
        console.error('Error starting stream:', error);
        toast({
          title: t("stream.error.start"),
          description: t("stream.error.start"),
          variant: "destructive",
        });
      }
    } else {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          const { error } = await supabase
            .from('streams')
            .update({ status: 'offline' })
            .eq('user_id', session.user.id)
            .eq('status', 'live');

          if (error) throw error;
        }

        setIsStreaming(false);
        toast({
          title: t("stream.success.stop"),
          description: t("stream.success.stop"),
        });
      } catch (error) {
        console.error('Error stopping stream:', error);
        toast({
          title: t("stream.error.stop"),
          description: t("stream.error.stop"),
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-6">
        <div className="flex justify-between items-center mb-6">
          <div className="max-w-md">
            <label htmlFor="streamTitle" className="block text-sm font-medium mb-2">
              {t('stream.streamTitle')}
            </label>
            <Input
              id="streamTitle"
              value={streamTitle}
              onChange={(e) => setStreamTitle(e.target.value)}
              placeholder={t('stream.enterTitle')}
              maxLength={100}
            />
          </div>
          <Button
            variant={isStreaming ? "destructive" : "default"}
            size="lg"
            onClick={toggleStreaming}
            className="px-8 py-6 text-lg font-semibold"
          >
            {isStreaming ? t('stream.stopStream') : t('stream.startStream')}
          </Button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <StreamSection
            videoRef={videoRef}
            screenRef={screenRef}
            isWebcamEnabled={isWebcamEnabled}
            isMicEnabled={isMicEnabled}
            isScreenShareEnabled={isScreenShareEnabled}
            onToggleWebcam={toggleWebcam}
            onToggleMic={toggleMic}
            onToggleScreenShare={toggleScreenShare}
          />

          <ChatSection
            messages={chatMessages}
            chatDelay={chatDelay}
            onSendMessage={handleSendMessage}
            onChatDelayChange={setChatDelay}
          />
        </div>
      </main>
    </div>
  );
};

export default Stream;