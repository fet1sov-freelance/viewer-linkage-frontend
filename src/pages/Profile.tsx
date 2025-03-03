import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Header } from "@/components/Header";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Profile = () => {
  const { username } = useParams();
  const { t } = useTranslation();

  // Mock data - в реальном приложении данные будут загружаться с сервера
  const profile = {
    username: username,
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde",
    backgroundImage: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
    totalStreams: 156,
    followers: 1420,
    hoursStreamed: 468,
    maxViewers: 2103,
    categories: ["Gaming", "Just Chatting", "Art"]
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Background Image */}
        <div 
          className="h-48 w-full bg-cover bg-center"
          style={{ backgroundImage: `url(${profile.backgroundImage})` }}
        >
          <div className="absolute inset-0 bg-black/40" />
        </div>

        {/* Profile Info */}
        <div className="container -mt-16 relative z-10">
          <Card className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Avatar */}
              <Avatar className="w-32 h-32 border-4 border-background">
                <AvatarImage src={profile.avatar} alt={profile.username} />
                <AvatarFallback>{profile.username?.[0]?.toUpperCase()}</AvatarFallback>
              </Avatar>

              {/* Stats */}
              <div className="flex-1 space-y-4">
                <h1 className="text-3xl font-bold">{profile.username}</h1>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold">{profile.totalStreams}</div>
                    <div className="text-sm text-muted-foreground">{t('profile.streams')}</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold">{profile.followers}</div>
                    <div className="text-sm text-muted-foreground">{t('profile.followers')}</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold">{profile.hoursStreamed}</div>
                    <div className="text-sm text-muted-foreground">{t('profile.hours')}</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold">{profile.maxViewers}</div>
                    <div className="text-sm text-muted-foreground">{t('profile.maxViewers')}</div>
                  </div>
                </div>

                {/* Categories */}
                <div>
                  <h3 className="font-semibold mb-2">{t('profile.categories')}</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.categories.map((category) => (
                      <Badge key={category} variant="secondary">
                        {category}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Settings Button */}
                <Button variant="outline">
                  {t('profile.settings')}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Profile;