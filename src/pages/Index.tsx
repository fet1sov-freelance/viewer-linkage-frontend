import { Header } from "@/components/Header";
import { StreamCard } from "@/components/StreamCard";
import { useTranslation } from "react-i18next";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { memo, useMemo } from "react";

interface Stream {
  id: string;
  status: string;
  viewer_count: number;
  thumbnail_url: string;
  profiles: {
    username: string;
    avatar_url: string | null;
  } | null;
}

interface StreamData {
  username: string;
  viewers: number;
  status: "online" | "offline";
  thumbnail: string;
  avatar?: string;
}

const IndexComponent = () => {
  const { t } = useTranslation();
  const { toast } = useToast();

  const { data: streams = [], isLoading } = useQuery({
    queryKey: ['streams'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('streams')
        .select(`
          id,
          status,
          viewer_count,
          thumbnail_url,
          profiles (
            username,
            avatar_url
          )
        `)
        .returns<Stream[]>();

      if (error) {
        toast({
          title: "Ошибка",
          description: "Не удалось загрузить трансляции",
          variant: "destructive",
        });
        throw error;
      }

      const userStreams = new Map<string, Stream>();
      
      data.forEach(stream => {
        const username = stream.profiles?.username;
        if (username) {
          const existingStream = userStreams.get(username);
          if (!existingStream || (stream.status === 'live' && existingStream.status !== 'live')) {
            userStreams.set(username, stream);
          }
        }
      });

      return Array.from(userStreams.values()).map((stream): StreamData => ({
        username: stream.profiles?.username || 'Unknown',
        viewers: stream.viewer_count || 0,
        status: stream.status === 'live' ? 'online' : 'offline',
        thumbnail: stream.thumbnail_url || 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b',
        avatar: stream.profiles?.avatar_url || undefined,
      }));
    },
    refetchInterval: 5000,
  });

  const onlineStreams = useMemo(() => 
    streams.filter(stream => stream.status === 'online'),
    [streams]
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container py-6 space-y-8">
          <div className="text-center py-8 text-muted-foreground">
            {t('common.loading')}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container py-6 space-y-8">
        <section>
          <h2 className="text-2xl font-bold mb-4">{t('streams.featured')}</h2>
          {onlineStreams.length > 0 ? (
            <Carousel className="w-full">
              <CarouselContent>
                {onlineStreams.map((stream) => (
                  <CarouselItem key={stream.username} className="md:basis-1/3 lg:basis-1/4 xl:basis-1/5">
                    <StreamCard {...stream} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              {t('streams.no_active')}
            </div>
          )}
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">{t('streams.all')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
            {streams.map((stream) => (
              <StreamCard key={stream.username} {...stream} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export const Index = memo(IndexComponent);

export default Index;