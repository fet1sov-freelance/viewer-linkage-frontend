import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { memo } from "react";

interface StreamCardProps {
  username: string;
  viewers: number;
  status: "online" | "offline";
  thumbnail: string;
  avatar?: string;
}

const StreamCardComponent = ({ username, viewers, status, thumbnail, avatar }: StreamCardProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const handleAvatarClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/profile/${username}`);
  };
  
  const handleCardClick = () => {
    navigate(`/stream/${username}`);
  };
  
  return (
    <Card 
      className="group relative overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-lg cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="relative aspect-video overflow-hidden">
        <img
          src={thumbnail}
          alt={`${username}'s stream`}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <Badge
          variant="secondary"
          className={cn(
            "absolute left-3 top-3",
            status === "online" ? "bg-stream-online text-white" : "bg-stream-offline text-white"
          )}
        >
          {status === "online" ? t('stream.status.live') : t('stream.status.offline')}
        </Badge>
        {status === "online" && (
          <Badge variant="secondary" className="absolute right-3 top-3 bg-black/50 text-white">
            {viewers} {t('stream.viewers')}
          </Badge>
        )}
      </div>
      <div className="p-4 flex items-center gap-3">
        <Avatar className="cursor-pointer hover:ring-2 hover:ring-primary" onClick={handleAvatarClick}>
          <AvatarImage src={avatar} alt={username} />
          <AvatarFallback>{username[0].toUpperCase()}</AvatarFallback>
        </Avatar>
        <h3 className="font-semibold truncate">{username}</h3>
      </div>
    </Card>
  );
};

export const StreamCard = memo(StreamCardComponent);