import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, TrendingUp, MessageCircle, Bell } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTranslation } from "react-i18next";
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileMenu } from "./header/MobileMenu";
import { LanguageSelector } from "./header/LanguageSelector";
import { AuthButtons } from "./header/AuthButtons";
import { memo } from "react";
import i18n from "@/i18n/config"; // Add this import

const HeaderComponent = () => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  const languages = {
    ru: "Русский",
    en: "English",
    es: "Español",
    ja: "日本語",
  };

  const handleTelegramSupport = () => {
    window.open('https://t.me/your_support_chat', '_blank');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          <MobileMenu 
            languages={languages}
            handleLanguageChange={async (lang: string) => {
              await i18n.changeLanguage(lang);
            }}
            handleTelegramSupport={handleTelegramSupport}
          />
          <a href="/" className="text-xl font-bold">
            Stream
          </a>
          <div className="hidden md:flex relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={t('search.placeholder')}
              className="w-[300px] pl-9"
            />
          </div>
        </div>
        <div className="flex items-center gap-2 md:gap-4">
          <Button 
            variant="ghost" 
            size="default"
            className="hidden md:flex bg-gradient-to-r from-[#9b87f5]/90 to-[#7E69AB]/90 text-white hover:from-[#8B5CF6]/90 hover:to-[#6E59A5]/90 px-6"
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            {t('nav.topStreams')}
          </Button>

          <div className="hidden md:flex items-center">
            <LanguageSelector 
              languages={languages}
              handleLanguageChange={async (lang: string) => {
                await i18n.changeLanguage(lang);
              }}
            />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={handleTelegramSupport}
                  >
                    <MessageCircle className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-white/90 backdrop-blur-sm">
                  <p>{t('support.telegram')}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon"
                  >
                    <Bell className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-white/90 backdrop-blur-sm">
                  <p>{t('notifications')}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <AuthButtons isMobile={isMobile} />
        </div>
      </div>
    </header>
  );
};

export const Header = memo(HeaderComponent);