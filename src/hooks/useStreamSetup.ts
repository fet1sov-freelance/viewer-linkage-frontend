import { useState, useRef } from "react";
import { toast } from "@/hooks/use-toast";

export const useStreamSetup = () => {
  const [isWebcamEnabled, setIsWebcamEnabled] = useState(false);
  const [isMicEnabled, setIsMicEnabled] = useState(false);
  const [isScreenShareEnabled, setIsScreenShareEnabled] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const screenRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);

  const toggleWebcam = async () => {
    try {
      if (!isWebcamEnabled) {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            width: { ideal: 1920 },
            height: { ideal: 1080 },
            frameRate: { ideal: 60 }
          } 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          streamRef.current = stream;
        }
        setIsWebcamEnabled(true);
        toast({
          title: "Камера включена",
          description: "Веб-камера успешно активирована",
        });
      } else {
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }
        if (videoRef.current) {
          videoRef.current.srcObject = null;
        }
        setIsWebcamEnabled(false);
        toast({
          title: "Камера выключена",
          description: "Веб-камера деактивирована",
        });
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось получить доступ к веб-камере",
        variant: "destructive",
      });
    }
  };

  const toggleMic = async () => {
    try {
      if (!isMicEnabled) {
        const audioStream = await navigator.mediaDevices.getUserMedia({ 
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            sampleRate: 48000
          } 
        });
        streamRef.current = streamRef.current 
          ? new MediaStream([...streamRef.current.getTracks(), ...audioStream.getTracks()])
          : audioStream;
        setIsMicEnabled(true);
        toast({
          title: "Микрофон включен",
          description: "Микрофон успешно активирован",
        });
      } else {
        if (streamRef.current) {
          streamRef.current.getAudioTracks().forEach(track => track.stop());
        }
        setIsMicEnabled(false);
        toast({
          title: "Микрофон выключен",
          description: "Микрофон деактивирован",
        });
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось получить доступ к микрофону",
        variant: "destructive",
      });
    }
  };

  const toggleScreenShare = async () => {
    try {
      if (!isScreenShareEnabled) {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: {
            displaySurface: "monitor",
            frameRate: { ideal: 60 }
          },
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            sampleRate: 48000
          }
        });
        
        if (screenRef.current) {
          screenRef.current.srcObject = screenStream;
          screenStreamRef.current = screenStream;
        }
        setIsScreenShareEnabled(true);
        toast({
          title: "Захват экрана включен",
          description: "Демонстрация экрана активирована",
        });
      } else {
        if (screenStreamRef.current) {
          screenStreamRef.current.getTracks().forEach(track => track.stop());
        }
        if (screenRef.current) {
          screenRef.current.srcObject = null;
        }
        setIsScreenShareEnabled(false);
        toast({
          title: "Захват экрана выключен",
          description: "Демонстрация экрана остановлена",
        });
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось получить доступ к захвату экрана",
        variant: "destructive",
      });
    }
  };

  return {
    isWebcamEnabled,
    isMicEnabled,
    isScreenShareEnabled,
    isStreaming,
    setIsStreaming,
    videoRef,
    screenRef,
    toggleWebcam,
    toggleMic,
    toggleScreenShare,
    streamRef,
    screenStreamRef
  };
};