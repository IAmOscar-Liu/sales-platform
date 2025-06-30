import switchListView from "@/assets/switch-list-view.svg";
import switchTableView from "@/assets/switch-table-view.svg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { SearchIcon } from "lucide-react";
import { useState } from "react";

function StudySearch({ className }: { className?: string }) {
  return (
    <form
      className={cn("flex flex-wrap items-end gap-3", className)}
      onSubmit={(e) => e.preventDefault()}
    >
      <div className="relative mb-1 w-[100px] flex-grow-3">
        <Input className="pr-10" placeholder="Search study" />
        <button
          type="button"
          className="text-muted-foreground absolute top-1/2 right-2 -translate-y-1/2 text-sm"
          tabIndex={-1}
        >
          <SearchIcon size={16} />
        </button>
      </div>

      <div className="w-[100px] flex-grow space-y-1">
        <Label className="text-muted-foreground" htmlFor="search-doctor">
          Doctor
        </Label>
        <Select>
          <SelectTrigger id="search-doctor" className="w-full">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Doctor</SelectLabel>
              <SelectItem value="doctor A">Doctor A</SelectItem>
              <SelectItem value="doctor B">Doctor B</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="w-[100px] flex-grow space-y-1">
        <Label className="text-muted-foreground" htmlFor="search-date">
          Date
        </Label>
        <Select>
          <SelectTrigger id="search-date" className="w-full">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Date</SelectLabel>
              <SelectItem value="month">This month</SelectItem>
              <SelectItem value="year">This year</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="w-[100px] flex-grow space-y-1">
        <Label className="text-muted-foreground" htmlFor="search-status">
          Status
        </Label>
        <Select>
          <SelectTrigger id="search-status" className="w-full">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Status</SelectLabel>
              <SelectItem value="all">All status</SelectItem>
              <SelectItem value="available">Available</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <IconSwitch className="mb-1" />
    </form>
  );
}

function IconSwitch({ className }: { className?: string }) {
  const [isChecked, setIsChecked] = useState(false);

  const handleToggle = () => {
    setIsChecked(!isChecked);
  };

  return (
    <div className={cn("flex h-9 items-center", className)}>
      <Button
        className="bg-muted relative h-[36px] w-[67px] rounded-full"
        variant="outline"
        onClick={handleToggle}
      >
        <div
          className={cn(
            "absolute top-[50%] left-[3px] flex size-[30px] -translate-y-[50%] rounded-full",
            { "bg-primary": !isChecked },
          )}
        >
          <img
            className="m-auto size-[14px] invert"
            src={switchTableView}
            alt=""
          />
        </div>
        <div
          className={cn(
            "absolute top-[50%] right-[3px] flex size-[30px] -translate-y-[50%] rounded-full",
            { "bg-primary": isChecked },
          )}
        >
          <img
            className="m-auto size-[14px] text-white invert"
            src={switchListView}
            alt=""
          />
        </div>
      </Button>
    </div>
  );
}

export default StudySearch;
