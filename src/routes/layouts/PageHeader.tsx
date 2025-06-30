import STLogo from "@/assets/symptomtrace_logo.png";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthProvider";
import { useTheme } from "@/context/ThemeProvider";
import { cn } from "@/lib/utils";
import { Menu, UserCircle2Icon } from "lucide-react";
import { Link } from "react-router-dom";
import DefaultTitle from "./DefaultTitle";
import HeaderMenuSettings from "./HeaderMenuSettings";
import { useSidebarContext } from "./SidebarData";

function PageHeader() {
  const { currentUser } = useAuth();

  return (
    <header className="z-10 flex h-[60px] gap-4 shadow-md dark:shadow-neutral-700">
      <div className="w-56">
        <PageHeaderLogoSection />
      </div>
      <DefaultTitle className="flex-grow" />
      <div className="me-4 flex items-center gap-2">
        <UserCircle2Icon size={28} className="text-foreground" />

        <div className="min-w-[10ch]">
          <p className="text-foreground mb-[-2px]">
            {currentUser?.name || "N/A"}
          </p>
          <p className="text-muted-foreground max-w-[30ch] truncate text-sm">
            {currentUser?.email || "N/A"}
          </p>
        </div>

        <HeaderMenuSettings />
      </div>
    </header>
  );
}

export function PageHeaderLogoSection() {
  const { toggle } = useSidebarContext();
  const { currentTheme } = useTheme();

  return (
    <div className="flex h-full flex-shrink-0 items-center gap-2 px-1.5 py-1.5">
      <Button onClick={toggle} variant="ghost" size="icon">
        <Menu />
      </Button>
      <Link to="/start" className="h-full flex-grow">
        <img
          src={STLogo}
          className={cn("size-full object-contain object-left", {
            invert: currentTheme === "dark",
          })}
          alt=""
        />
      </Link>
      {/* <Link
        to="/start"
        className="flex items-center gap-2 text-2xl font-semibold text-foreground"
      >
        <img src={cmsBrand} alt="" />
        ST
      </Link> */}
    </div>
  );
}

export default PageHeader;
