import { cn } from "@/lib/utils";
import { Loader2Icon } from "lucide-react";

function DialogLoading({ className }: { className?: string }) {
  return (
    <div className={cn("flex h-[50vh] items-center justify-center", className)}>
      <Loader2Icon className="text-primary size-7 animate-spin" />
    </div>
  );
}

export default DialogLoading;
