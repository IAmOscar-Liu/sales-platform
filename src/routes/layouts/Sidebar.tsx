import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import * as LucideIcons from "lucide-react";
import { Children, ElementType, Fragment, ReactNode, useState } from "react";
import { useIntl } from "react-intl";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { PageHeaderLogoSection } from "./PageHeader";
import { RequireAuth } from "./RequireAuth";
import { useSidebarContext } from "./SidebarData";
import FacilityInfo from "./FacilityInfo";

type SmallSidebarItemProps = {
  isActive?: boolean;
  Icon: ElementType;
  title: string;
  url?: string;
  children?: ReactNode;
  acceptAuths: string[];
};

type SmallSidebarSubItemProps = {
  Icon: ElementType;
  title: string;
  url: string;
  acceptAuths: string[];
};

type LargeSidebarSectionProps = {
  children: ReactNode;
  title?: string;
  visibleItemCount?: number;
  acceptAuths: string[];
};

type LargeSidebarItemProps = {
  IconOrImgUrl: ElementType | string;
  title: string;
  url: string;
  acceptAuths: string[];
};

function Sidebar() {
  const { isLargeOpen, isSmallOpen, close } = useSidebarContext();
  const { formatMessage: t } = useIntl();

  return (
    <>
      <aside
        className={cn(
          "scrollbar-hidden bg-sidebar text-foreground sticky top-0 flex w-[96px] flex-col overflow-y-auto px-1 pt-2 pb-2",
          {
            "lg:hidden": isLargeOpen,
            "lg:flex": !isLargeOpen,
          },
        )}
      >
        <SmallSidebarItem
          Icon={LucideIcons.Home}
          title={t({ id: "MENU.START" })}
          url="/start"
          acceptAuths={[]}
        />
        <SmallSidebarItem
          Icon={LucideIcons.LayoutDashboardIcon}
          title={t({ id: "MENU.DASHBOARD" })}
          url="/dashboard"
          acceptAuths={[]}
        />
        <SmallSidebarItem
          Icon={LucideIcons.UserRoundIcon}
          title={t({ id: "MENU.SALESMAN" })}
          url="/salesman"
          acceptAuths={[]}
        />
        <SmallSidebarItem
          Icon={LucideIcons.SchoolIcon}
          title={t({ id: "MENU.RESEARCH_MNG" })}
          url="/research"
          acceptAuths={[]}
        >
          <SmallSidebarSubItem
            Icon={LucideIcons.GraduationCapIcon}
            title={t({ id: "MENU.RESEARCH_MNG.STUDY" })}
            url="/research/study"
            acceptAuths={[]}
          />
          <SmallSidebarSubItem
            Icon={LucideIcons.BookTextIcon}
            title={t({ id: "MENU.RESEARCH_MNG.SURVEY" })}
            url="/research/survey"
            acceptAuths={[]}
          />
          <SmallSidebarSubItem
            Icon={LucideIcons.CalendarSyncIcon}
            title={t({ id: "MENU.RESEARCH_MNG.SCHEDULE" })}
            url="/research/schedule"
            acceptAuths={[]}
          />
        </SmallSidebarItem>
        <SmallSidebarItem
          Icon={LucideIcons.UserCheckIcon}
          title={t({ id: "MENU.ACCOUNT_MNG" })}
          url="/account"
          acceptAuths={[]}
        >
          <SmallSidebarSubItem
            Icon={LucideIcons.TagsIcon}
            title={t({ id: "MENU.ACCOUNT_MNG.ROLE" })}
            url="/account/role"
            acceptAuths={[]}
          />
          <SmallSidebarSubItem
            Icon={LucideIcons.UserCog2Icon}
            title={t({ id: "MENU.ACCOUNT_MNG.USER" })}
            url="/account/user"
            acceptAuths={[]}
          />
        </SmallSidebarItem>
      </aside>
      {isSmallOpen && (
        <div
          onClick={close}
          className="bg-secondary-dark fixed inset-0 z-[999] opacity-50 lg:hidden"
        />
      )}
      <aside
        className={cn(
          "scrollbar-hidden absolute top-0 w-56 flex-col gap-1 overflow-y-auto px-2 pt-2 pb-4 lg:sticky",
          {
            "lg:flex": isLargeOpen,
            "lg:hidden": !isLargeOpen,
            "z-[999] flex min-h-screen": isSmallOpen,
            hidden: !isSmallOpen,
          },
        )}
      >
        <div className="sticky top-0 h-[60px] px-2 lg:hidden">
          <PageHeaderLogoSection />
        </div>

        <FacilityInfo className="mt-1.5 mb-0.5" />

        <LargeSidebarSection acceptAuths={[]}>
          <LargeSidebarItem
            IconOrImgUrl={LucideIcons.Home}
            title={t({ id: "MENU.START" })}
            url="/start"
            acceptAuths={[]}
          />
          <LargeSidebarItem
            IconOrImgUrl={LucideIcons.LayoutDashboardIcon}
            title={t({ id: "MENU.DASHBOARD" })}
            url="/dashboard"
            acceptAuths={[]}
          />
          <LargeSidebarItem
            IconOrImgUrl={LucideIcons.UserRoundIcon}
            title={t({ id: "MENU.SALESMAN" })}
            url="/salesman"
            acceptAuths={[]}
          />
        </LargeSidebarSection>
        <hr />
        <LargeSidebarSection
          title={t({ id: "MENU.RESEARCH_MNG" })}
          acceptAuths={[]}
        >
          <LargeSidebarItem
            IconOrImgUrl={LucideIcons.GraduationCap}
            title={t({ id: "MENU.RESEARCH_MNG.STUDY" })}
            url="/research/study"
            acceptAuths={[]}
          />
          <LargeSidebarItem
            IconOrImgUrl={LucideIcons.BookTextIcon}
            title={t({ id: "MENU.RESEARCH_MNG.SURVEY" })}
            url="/research/survey"
            acceptAuths={[]}
          />
          <LargeSidebarItem
            IconOrImgUrl={LucideIcons.CalendarSyncIcon}
            title={t({ id: "MENU.RESEARCH_MNG.SCHEDULE" })}
            url="/research/schedule"
            acceptAuths={[]}
          />
        </LargeSidebarSection>
        <hr />
        <LargeSidebarSection
          title={t({ id: "MENU.ACCOUNT_MNG" })}
          acceptAuths={[]}
        >
          <LargeSidebarItem
            IconOrImgUrl={LucideIcons.TagsIcon}
            title={t({ id: "MENU.ACCOUNT_MNG.ROLE" })}
            url="/account/role"
            acceptAuths={[]}
          />
          <LargeSidebarItem
            IconOrImgUrl={LucideIcons.ContactIcon}
            title={t({ id: "MENU.ACCOUNT_MNG.USER" })}
            url="/account/user"
            acceptAuths={[]}
          />
        </LargeSidebarSection>
        <hr />
      </aside>
    </>
  );
}

function SmallSidebarItem({
  Icon,
  title,
  url,
  children,
  acceptAuths,
}: SmallSidebarItemProps) {
  const { pathname } = useLocation();
  const isActive = !!url && pathname.startsWith(url); // url?.startsWith(pathname);

  if (!children)
    return (
      <RequireAuth acceptAuths={acceptAuths}>
        <Link
          to={url ?? ""}
          className={cn(
            "hover:bg-foreground/10 my-0.5 flex flex-col items-center gap-1 rounded-lg px-1 py-2 whitespace-nowrap transition-colors",
            {
              "bg-foreground/10 pointer-events-none: font-semibold": isActive,
            },
          )}
        >
          <Icon className="size-6" />
          <div className="text-sm">{title}</div>
        </Link>
      </RequireAuth>
    );

  const childrenArray = Children.toArray(children).flat();

  return (
    <RequireAuth acceptAuths={acceptAuths}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="my-0.5 h-[64px] p-0 !ring-transparent"
          >
            <div
              className={cn(
                "hover:bg-foreground/10 flex size-full cursor-pointer flex-col items-center justify-center gap-1 rounded-lg px-1 py-2 whitespace-nowrap transition-colors",
                {
                  "bg-foreground/10 pointer-events-none font-semibold":
                    isActive,
                },
              )}
            >
              <Icon className="!size-6" />
              <div className="flex w-full items-center gap-0.5 text-sm">
                <span className="truncate">{title}</span>
                <LucideIcons.ChevronDown className="size-3 flex-shrink-0" />
              </div>
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right">
          {childrenArray.map((ch, idx) => (
            <Fragment key={idx}>{ch}</Fragment>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </RequireAuth>
  );
}

function SmallSidebarSubItem({
  Icon,
  title,
  url,
  acceptAuths,
}: SmallSidebarSubItemProps) {
  const { pathname } = useLocation();
  // const isActive = pathname.startsWith(url); // url?.startsWith(pathname);
  const isActive = pathname === url; // url?.startsWith(pathname);
  const navigate = useNavigate();

  return (
    <RequireAuth acceptAuths={acceptAuths}>
      <DropdownMenuItem
        className={cn(
          "text-foreground hover:bg-foreground/10 flex items-center gap-2",
          {
            "bg-foreground/10 pointer-events-none": isActive,
          },
        )}
        onClick={() => navigate(url)}
      >
        <Icon className="size-4" />
        <div>{title}</div>
      </DropdownMenuItem>
    </RequireAuth>
  );
}

function LargeSidebarSection({
  children,
  title,
  visibleItemCount = 3,
  acceptAuths,
}: LargeSidebarSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const childrenArray = Children.toArray(children).flat();
  const showExpandButton = childrenArray.length > visibleItemCount;
  const visibleChildren = isExpanded
    ? childrenArray
    : childrenArray.slice(0, visibleItemCount);
  const ButtonIcon = isExpanded
    ? LucideIcons.ChevronUp
    : LucideIcons.ChevronDown;

  return (
    <RequireAuth acceptAuths={acceptAuths}>
      <div>
        {title && (
          <div className="text-muted-foreground mb-1 ml-4">{title}</div>
        )}
        {visibleChildren}
        {showExpandButton && (
          <Button
            className="text-foreground"
            onClick={() => setIsExpanded((e) => !e)}
            variant="ghost"
          >
            <ButtonIcon className="size-6" />
            {isExpanded ? "Show Less" : "Show More"}
          </Button>
        )}
      </div>
    </RequireAuth>
  );
}

function LargeSidebarItem({
  IconOrImgUrl,
  title,
  url,
  acceptAuths,
}: LargeSidebarItemProps) {
  const { pathname } = useLocation();
  // const isActive = pathname.startsWith(url); // url?.startsWith(pathname);
  const isActive = pathname === url; // url?.startsWith(pathname);

  return (
    <RequireAuth acceptAuths={acceptAuths}>
      <Link
        to={url}
        className={cn(
          "hover:bg-foreground/10 my-0.5 flex w-full items-center gap-4 rounded-lg px-3 py-2 whitespace-nowrap transition-colors",
          {
            "bg-foreground/10 pointer-events-none font-bold": isActive,
          },
        )}
        // className={twMerge(
        //   buttonStyles({ variant: "ghost" }),
        //   `flex w-full items-center gap-4 rounded-lg px-3 py-2 ${
        //     isActive
        //       ? "hover:bg-secondary-hover dark:hover:bg-secondary-dark-hover bg-neutral-200 font-bold dark:bg-neutral-800"
        //       : undefined
        //   }`,
        // )}
      >
        {typeof IconOrImgUrl === "string" ? (
          <img src={IconOrImgUrl} className="size-6 rounded-full" />
        ) : (
          <IconOrImgUrl className="text-foreground size-6" />
        )}
        <div className="text-foreground overflow-hidden text-ellipsis whitespace-nowrap">
          {title}
        </div>
      </Link>
    </RequireAuth>
  );
}

export default Sidebar;
