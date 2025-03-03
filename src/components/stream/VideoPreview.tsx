import { RefObject } from "react";

interface VideoPreviewProps {
  videoRef: RefObject<HTMLVideoElement>;
  controls?: JSX.Element;
  className?: string;
}

export function VideoPreview({ videoRef, controls, className }: VideoPreviewProps) {
  return (
    <div className={`bg-card rounded-lg p-6 relative border-2 border-[#9b87f5] ${className}`}>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover rounded-lg"
      />
      {controls && (
        <div className="absolute bottom-8 right-8 flex gap-4">
          {controls}
        </div>
      )}
    </div>
  );
}