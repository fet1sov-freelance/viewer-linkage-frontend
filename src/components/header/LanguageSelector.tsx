import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslation } from "react-i18next";

interface LanguageSelectorProps {
  languages: Record<string, string>;
  handleLanguageChange: (lang: string) => void;
}

export function LanguageSelector({ languages, handleLanguageChange }: LanguageSelectorProps) {
  const { i18n } = useTranslation();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Globe className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-[200px] bg-white/90 backdrop-blur-sm border border-gray-200 shadow-lg" 
        style={{ zIndex: 9999 }}
      >
        {Object.entries(languages).map(([code, name]) => (
          <DropdownMenuCheckboxItem
            key={code}
            checked={i18n.language === code}
            onCheckedChange={() => handleLanguageChange(code)}
            className="hover:bg-gray-100/90"
          >
            {name}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}