import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Globe, TrendingUp, MessageCircle, Menu, Bell } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslation } from "react-i18next";

interface MobileMenuProps {
  languages: Record<string, string>;
  handleLanguageChange: (lang: string) => void;
  handleTelegramSupport: () => void;
}

export function MobileMenu({ languages, handleLanguageChange, handleTelegramSupport }: MobileMenuProps) {
  const { t, i18n } = useTranslation();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px] bg-background/95 backdrop-blur-sm">
        <SheetHeader>
          <SheetTitle>{t('nav.menu')}</SheetTitle>
        </SheetHeader>
        <div className="py-4 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={t('search.placeholder')}
              className="w-full pl-9"
            />
          </div>
          <Button 
            variant="ghost" 
            size="default"
            className="w-full bg-gradient-to-r from-[#9b87f5] to-[#7E69AB] text-white hover:from-[#8B5CF6] hover:to-[#6E59A5]"
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            {t('nav.topStreams')}
          </Button>
          <div className="relative">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="default" className="w-full">
                  <Globe className="h-4 w-4 mr-2" />
                  {t('nav.language')}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="start" 
                className="w-[200px] bg-background border shadow-lg z-[9999]"
              >
                {Object.entries(languages).map(([code, name]) => (
                  <DropdownMenuCheckboxItem
                    key={code}
                    checked={i18n.language === code}
                    onCheckedChange={() => handleLanguageChange(code)}
                  >
                    {name}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <Button 
            variant="ghost" 
            size="default"
            className="w-full"
            onClick={handleTelegramSupport}
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            {t('support.telegram')}
          </Button>
          <Button 
            variant="ghost" 
            size="default"
            className="w-full"
          >
            <Bell className="h-4 w-4 mr-2" />
            {t('notifications')}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}