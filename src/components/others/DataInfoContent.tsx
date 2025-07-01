import { cn } from "@/lib/utils";

function DataInfoContent({
  title,
  value,
  className = "",
  contentClassName,
}: {
  title?: string;
  value: any;
  className?: string;
  contentClassName?: string;
}) {
  return (
    <div className={cn("", className)}>
      {title && <span className="text-muted-foreground text-sm">{title}:</span>}
      <div className={cn("bg-input rounded-md px-2 py-1.5", contentClassName)}>
        {value ? (
          <span className="w-full break-words">{value}</span>
        ) : typeof value === "number" ? (
          <span className="w-full break-words">{value}</span>
        ) : (
          <span className="opacity-0">None</span>
        )}
      </div>
    </div>
  );
}

export default DataInfoContent;
