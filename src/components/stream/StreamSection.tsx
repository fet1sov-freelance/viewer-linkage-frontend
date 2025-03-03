import { VideoPreview } from "./VideoPreview";
import { StreamControls } from "./StreamControls";
import { Button } from "@/components/ui/button";
import { MonitorPlay } from "lucide-react";

interface StreamSectionProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  screenRef: React.RefObject<HTMLVideoElement>;
  isWebcamEnabled: boolean;
  isMicEnabled: boolean;
  isScreenShareEnabled: boolean;
  onToggleWebcam: () => void;
  onToggleMic: () => void;
  onToggleScreenShare: () => void;
}

export function StreamSection({
  videoRef,
  screenRef,
  isWebcamEnabled,
  isMicEnabled,
  isScreenShareEnabled,
  onToggleWebcam,
  onToggleMic,
  onToggleScreenShare,
}: StreamSectionProps) {
  return (
    <div className="lg:col-span-2 space-y-6">
      <VideoPreview 
        videoRef={videoRef}
        className="h-[400px]"
        controls={
          <StreamControls
            isWebcamEnabled={isWebcamEnabled}
            isMicEnabled={isMicEnabled}
            isScreenShareEnabled={isScreenShareEnabled}
            onToggleWebcam={onToggleWebcam}
            onToggleMic={onToggleMic}
            onToggleScreenShare={onToggleScreenShare}
          />
        }
      />

      <VideoPreview 
        videoRef={screenRef}
        className="h-[300px]"
        controls={
          <Button
            variant={isScreenShareEnabled ? "default" : "secondary"}
            size="icon"
            onClick={onToggleScreenShare}
            className="w-12 h-12"
          >
            <MonitorPlay className="h-6 w-6" />
          </Button>
        }
      />
    </div>
  );
}