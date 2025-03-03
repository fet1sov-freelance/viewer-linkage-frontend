import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Award, DollarSign, Share2, UserPlus } from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

export function StreamActions() {
  const { t } = useTranslation();
  const [donationAmount, setDonationAmount] = useState("");
  const [challengeDescription, setChallengeDescription] = useState("");
  const [challengeReward, setChallengeReward] = useState("");
  const [challengeTimeLimit, setChallengeTimeLimit] = useState("");

  const handleSubscribe = () => {
    toast({
      title: t("stream.subscribe.success"),
      description: t("stream.subscribe.description"),
    });
  };

  const handleDonate = () => {
    if (!donationAmount || isNaN(Number(donationAmount)) || Number(donationAmount) <= 0) {
      toast({
        title: t("stream.donate.error"),
        description: t("stream.donate.invalidAmount"),
        variant: "destructive",
      });
      return;
    }
    toast({
      title: t("stream.donate.success"),
      description: t("stream.donate.amount", { amount: donationAmount }),
    });
    setDonationAmount("");
  };

  const handleChallenge = () => {
    if (!challengeDescription || !challengeReward || !challengeTimeLimit) {
      toast({
        title: t("stream.challenge.error"),
        description: t("stream.challenge.fillFields"),
        variant: "destructive",
      });
      return;
    }
    toast({
      title: t("stream.challenge.success"),
      description: t("stream.challenge.created"),
    });
    setChallengeDescription("");
    setChallengeReward("");
    setChallengeTimeLimit("");
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: t("stream.share.success"),
      description: t("stream.share.copied"),
    });
  };

  return (
    <div className="bg-card rounded-lg p-6 space-y-4 border-2 border-[#9b87f5]">
      <Button onClick={handleSubscribe} className="w-full">
        <UserPlus className="mr-2 h-4 w-4" />
        Подписаться
      </Button>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full">
            <DollarSign className="mr-2 h-4 w-4" />
            Донат
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Отправить донат</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <Input
              type="number"
              placeholder="Сумма доната"
              value={donationAmount}
              onChange={(e) => setDonationAmount(e.target.value)}
            />
            <Button onClick={handleDonate} className="w-full">
              Отправить донат
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full">
            <Award className="mr-2 h-4 w-4" />
            Челлендж
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Создать челлендж</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <Input
              placeholder="Описание задания"
              value={challengeDescription}
              onChange={(e) => setChallengeDescription(e.target.value)}
            />
            <Input
              type="number"
              placeholder="Награда (₽)"
              value={challengeReward}
              onChange={(e) => setChallengeReward(e.target.value)}
            />
            <Input
              type="number"
              placeholder="Время на выполнение (минуты)"
              value={challengeTimeLimit}
              onChange={(e) => setChallengeTimeLimit(e.target.value)}
            />
            <Button onClick={handleChallenge} className="w-full">
              Создать челлендж
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Button variant="outline" onClick={handleShare} className="w-full">
        <Share2 className="mr-2 h-4 w-4" />
        Поделиться
      </Button>
    </div>
  );
}
