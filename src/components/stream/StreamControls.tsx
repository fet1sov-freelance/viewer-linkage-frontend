import { Button } from "@/components/ui/button";
import { Camera, Mic } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface StreamControlsProps {
  isWebcamEnabled: boolean;
  isMicEnabled: boolean;
  isScreenShareEnabled: boolean;
  onToggleWebcam: () => void;
  onToggleMic: () => void;
  onToggleScreenShare: () => void;
}

export function StreamControls({
  isWebcamEnabled,
  isMicEnabled,
  isScreenShareEnabled,
  onToggleWebcam,
  onToggleMic,
  onToggleScreenShare,
}: StreamControlsProps) {
  return (
    <>
      <Button
        variant={isWebcamEnabled ? "default" : "secondary"}
        size="icon"
        onClick={onToggleWebcam}
        className="w-12 h-12"
      >
        <Camera className="h-6 w-6" />
      </Button>
      <Button
        variant={isMicEnabled ? "default" : "secondary"}
        size="icon"
        onClick={onToggleMic}
        className="w-12 h-12"
      >
        <Mic className="h-6 w-6" />
      </Button>
    </>
  );
}