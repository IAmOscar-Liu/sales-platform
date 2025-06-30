import useClickOutside from "@/hooks/useClickOutside";
import { cn } from "@/lib/utils";
import {
  Children,
  createContext,
  Dispatch,
  MouseEvent,
  ReactNode,
  SetStateAction,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";

type DropdownMenuPosition = {
  height: number;
  width: number;
  x: number;
  y: number;
  bottom: number;
  left: number;
  right: number;
  top: number;
};

type DropdownMenuProps = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  position: DropdownMenuPosition;
  setPosition: Dispatch<SetStateAction<DropdownMenuPosition>>;
  windowWidth: number;
  setWindowWidth: Dispatch<SetStateAction<number>>;
};

const DropdownMenuContext = createContext<DropdownMenuProps | undefined>(
  undefined
);

function useDropdownMenu() {
  const value = useContext(DropdownMenuContext);
  if (!value) {
    throw new Error("useDropdownMenu must be used within DropdownMenuProvider");
  }
  return value;
}

function SimpleDropdownMenu({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<DropdownMenuPosition>({
    height: 0,
    width: 0,
    x: 0,
    y: 0,
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
  });
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  return (
    <DropdownMenuContext.Provider
      value={{
        isOpen,
        setIsOpen,
        position,
        setPosition,
        windowWidth,
        setWindowWidth,
      }}
    >
      <div className="relative">{children}</div>
    </DropdownMenuContext.Provider>
  );
}

function Trigger({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const { isOpen, setIsOpen, setPosition, setWindowWidth } = useDropdownMenu();

  const handleClick = (e: MouseEvent) => {
    if (isOpen) return;
    const rect = (e.currentTarget as Element).getBoundingClientRect();
    // console.log(rect);
    setPosition(rect);
    setWindowWidth(window.innerWidth);
    setIsOpen(true);
  };

  return (
    <div onClick={handleClick} className={className}>
      {children}
    </div>
  );
}

function Content({
  children,
  className,
  side = "bottom",
  sideOffset = 0,
  align = "start",
}: {
  children: ReactNode;
  className?: string;
  side?: "bottom" | "top" | "right" | "left";
  sideOffset?: number;
  align?: "end" | "start";
}) {
  const { isOpen, setIsOpen, position, windowWidth } = useDropdownMenu();
  const menuRef = useRef<HTMLDivElement>(null);

  useClickOutside(menuRef, () => setIsOpen(false));

  const stylePosition = useMemo(() => {
    const result: Partial<{
      top: number;
      bottom: number;
      left: number;
      right: number;
    }> = {};
    switch (side) {
      case "bottom":
        result.top = position.y + position.height + sideOffset;
        if (align === "start") result.left = position.x;
        else if (align === "end")
          result.right = windowWidth - (position.x + position.width);
        return result;
      case "top":
        result.bottom = position.y + sideOffset;
        if (align === "start") result.left = position.x;
        else if (align === "end")
          result.right = windowWidth - (position.x + position.width);
        return result;
      case "right":
        result.left = position.x + position.width + sideOffset;
        if (align === "start") result.top = position.y;
        else if (align === "end") result.bottom = position.y + position.height;
        return result;
      case "left":
        result.right = windowWidth - (position.x + sideOffset);
        if (align === "start") result.top = position.y;
        else if (align === "end") result.bottom = position.y + position.height;
        return result;
    }
  }, [position, side, sideOffset]);

  if (!isOpen) return null;
  return (
    <div
      ref={menuRef}
      className={cn(
        "fixed space-y-0.5 rounded-sm p-1 shadow-sm shadow-text-secondary",
        className
      )}
      style={stylePosition}
    >
      {children}
    </div>
  );
}

function Item({
  children,
  className,
  onClick,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  const { setIsOpen } = useDropdownMenu();

  return (
    <div
      className={cn("min-w-20 cursor-pointer", className)}
      onClick={() => {
        if (onClick) onClick();
        setIsOpen(false);
      }}
    >
      {children}
    </div>
  );
}

function SubMenu({ children }: { children: ReactNode }) {
  const childrenArray = Children.toArray(children);

  // Extract components by type
  const subTrigger = childrenArray.find(
    (child) => (child as any).type === SimpleDropdownMenu.SubTrigger
  );
  const subContent = childrenArray.find(
    (child) => (child as any).type === SimpleDropdownMenu.SubContent
  );

  return (
    <div className="group relative">
      {subTrigger}
      {subContent}
    </div>
  );
}

function SubTrigger({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("min-w-20 cursor-pointer", className)}>{children}</div>
  );
}

function SubContent({
  children,
  className,
  side = "right",
}: {
  children: ReactNode;
  className?: string;
  side?: "left" | "right";
}) {
  return (
    <div
      className={cn("absolute top-0 hidden pe-1 group-hover:block", {
        "right-full": side === "left",
        "left-full": side === "right",
      })}
    >
      <div
        className={cn(
          "space-y-0.5 rounded-sm p-1 shadow-sm shadow-text-secondary",
          className
        )}
      >
        {children}
      </div>
    </div>
  );
}

function SubItem({
  children,
  className,
  onClick,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  const { setIsOpen } = useDropdownMenu();

  return (
    <div
      className={cn("min-w-20 cursor-pointer", className)}
      onMouseDown={() => {
        if (onClick) onClick();
        setIsOpen(false);
      }}
    >
      {children}
    </div>
  );
}

SimpleDropdownMenu.Trigger = Trigger;
SimpleDropdownMenu.Content = Content;
SimpleDropdownMenu.Item = Item;

SimpleDropdownMenu.SubMenu = SubMenu;
SimpleDropdownMenu.SubTrigger = SubTrigger;
SimpleDropdownMenu.SubContent = SubContent;
SimpleDropdownMenu.SubItem = SubItem;

export default SimpleDropdownMenu;
