import { cn } from "@/lib/utils";
import { XCircleIcon } from "lucide-react";

function ErrorLoginInfo({
  error,
  className,
}: {
  error: any;
  className?: string;
}) {
  // console.log(error);
  return (
    <div
      className={cn(
        "border-destructive flex items-center gap-2 rounded-md border bg-red-200 px-3 py-1",
        className,
      )}
    >
      <XCircleIcon className="text-red-500" />
      <p className="text-red-500">
        {extractErrorMessage(error, "Unknown error!")}
      </p>
    </div>
  );
}

export function extractErrorMessage(error: any, fallback?: string) {
  if (typeof error?.response?.data?.message === "string")
    return String(error.response.data.message);
  else if (typeof error?.message === "string") return String(error.message);
  return fallback;
}

export default ErrorLoginInfo;
