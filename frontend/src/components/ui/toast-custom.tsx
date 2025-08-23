import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

interface ToastNotificationProps {
  message: string;
  type?: "success" | "error" | "info";
  duration?: number;
}

export function showToastNotification({ message, type = "info", duration = 3000 }: ToastNotificationProps) {
  const { toast } = useToast();
  
  const variant = type === "error" ? "destructive" : "default";
  const title = type === "success" ? "Success" : type === "error" ? "Error" : "Info";
  
  toast({
    title,
    description: message,
    variant,
    duration,
  });
}

// Toast container component for positioning
export function ToastContainer() {
  return (
    <div className="fixed top-4 right-4 space-y-2 z-50">
      {/* Toast notifications will be rendered here by the toaster */}
    </div>
  );
}
