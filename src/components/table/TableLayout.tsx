import { Loader2Icon } from "lucide-react";
import { ReactNode } from "react";
import { useIntl } from "react-intl";
import nodataImg from "@/assets/no_data.png";
import { cn } from "@/lib/utils";

function TableLayout({ children }: { children: ReactNode }) {
  return <div className="flex flex-col py-4">{children}</div>;
}

TableLayout.Loading = ({ className }: { className?: string }) => (
  <div className={cn("flex h-[150px] items-center justify-center", className)}>
    <div className="animate-spin">
      <Loader2Icon size={36} className="text-primary" />
    </div>
  </div>
);

TableLayout.Body = ({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) => {
  return <div className={cn("mb-4 min-h-[300px]", className)}>{children}</div>;
};

TableLayout.NoData = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { formatMessage: t } = useIntl();

  return (
    <div className="m-auto flex h-[400px] flex-col items-center justify-center gap-4">
      <img className="h-[244px] w-[244px]" src={nodataImg} alt="" />
      <span className="font-fold">{t({ id: "general.nodata" })}</span>
    </div>
  );
};

export default TableLayout;
