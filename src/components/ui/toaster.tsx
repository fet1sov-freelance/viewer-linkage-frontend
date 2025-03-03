import { Toaster as Sonner } from "sonner";
import { X } from "lucide-react";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      position="top-center"
      toastOptions={{
        duration: 3000,
        style: {
          background: 'var(--background)',
          border: '1px solid var(--border)',
          color: 'var(--foreground)',
          borderRadius: '0.5rem',
        },
        closeButton: true,
        classNames: {
          toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          closeButton: "bg-transparent border-none p-1 cursor-pointer text-muted-foreground hover:text-foreground transition-colors",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };