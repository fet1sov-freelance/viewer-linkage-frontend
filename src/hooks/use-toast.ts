import { toast as sonnerToast, type ToastT } from "sonner";

export type ToastProps = {
  title?: string;
  description?: string;
  duration?: number;
  action?: ToastT["action"];
  variant?: "default" | "destructive";
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "top-center" | "bottom-center";
};

export const toast = ({ title, description, duration = 3000, action, variant = "default" }: ToastProps) => {
  return sonnerToast(title, {
    description,
    duration,
    action,
    position: "top-center",
    className: variant === "destructive" ? "bg-destructive text-destructive-foreground" : undefined,
  });
};

export const useToast = () => {
  return {
    toast,
    toasts: [],
  };
};