import { cn } from "@/lib/utils";

function FacilityInfo({ className }: { className?: string }) {
  return (
    <div className={cn("bg-foreground/20 rounded-md px-2 py-1.5", className)}>
      <h2 className="truncate text-xl">Care Facility Name</h2>
      <p className="line-clamp-2 text-sm">Address</p>
    </div>
  );
}

export default FacilityInfo;
