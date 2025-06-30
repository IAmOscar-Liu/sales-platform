import { cn } from "@/lib/utils";
import { AlertCircleIcon, Loader2Icon, RefreshCcwIcon } from "lucide-react";
import { Button } from "../ui/button";

export function PageScreenLoading({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex min-h-full flex-grow items-center justify-center gap-4",
        className
      )}
    >
      <Loader2Icon size={36} className="animate-spin text-primary" />
      <h1 className="text-2xl text-foreground">Loading...</h1>
    </div>
  );
}

export function PageScreenError({
  className,
  error,
}: {
  className?: string;
  error: any;
}) {
  console.error("An error has been caught:", error);

  return (
    <div
      className={cn(
        "flex min-h-full flex-grow flex-col items-center justify-center gap-4",
        className
      )}
    >
      <AlertCircleIcon size={36} className="text-red-500" />
      <h1 className="text-2xl text-primary">Oops! Something went wrong</h1>
      <Button onClick={() => window.location.reload()}>
        <RefreshCcwIcon size={20} />
        Reload
      </Button>
    </div>
  );
}
