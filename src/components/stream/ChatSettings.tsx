import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslation } from "react-i18next";

interface ChatSettingsProps {
  chatDelay: string;
  onChatDelayChange: (delay: string) => void;
}

export function ChatSettings({ chatDelay, onChatDelayChange }: ChatSettingsProps) {
  const { t } = useTranslation();

  return (
    <div className="bg-card rounded-lg p-6 relative border-2 border-[#9b87f5]">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        {t('stream.chatSettings')}
      </h3>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="chatDelay">{t('stream.chatDelay')}</Label>
          <Input
            id="chatDelay"
            type="number"
            min="0"
            value={chatDelay}
            onChange={(e) => onChatDelayChange(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}