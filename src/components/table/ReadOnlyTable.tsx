import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export interface ReadOnlyTableColumnDef<T> {
  title: ReactNode | string;
  className?: string;
  value: (v: T, vIdx: number) => ReactNode | string;
  valueClick?: (v: T, vIdx: number) => void;
  disableClick?: (v: T, vIdx: number) => boolean;
}

function ReadOnlyTable<T>({
  data,
  columns,
  lastColumnAlignEnd = true,
}: {
  data: T[];
  columns: ReadOnlyTableColumnDef<T>[];
  lastColumnAlignEnd?: boolean;
}) {
  return (
    <div className="-m-1.5 overflow-x-auto">
      <div className="inline-block min-w-full p-1.5 align-middle">
        <div className="overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                {columns.map(({ title }, cIdx) => (
                  <th
                    key={cIdx}
                    scope="col"
                    className={cn(
                      "bg-disabled text-layout-header px-2 py-2.5 text-start font-semibold",
                      { "rounded-s-md": cIdx === 0 },
                      {
                        "rounded-e-md text-end":
                          cIdx === columns.length - 1 && lastColumnAlignEnd,
                      },
                    )}
                  >
                    <div
                      className={cn(
                        "flex w-[max-content] items-center gap-2 text-xs",
                        {
                          "ms-auto":
                            cIdx === columns.length - 1 && lastColumnAlignEnd,
                        },
                      )}
                    >
                      {title}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-red-200">
              {data.map((row, rIdx) => (
                <tr key={rIdx} className="even:bg-text-primary/5 odd:bg-white">
                  {columns.map(
                    (
                      { value, valueClick, className = "", disableClick },
                      cIdx,
                    ) => (
                      <td
                        key={cIdx}
                        className={cn("px-2 py-3 text-sm text-gray-800", {
                          "text-end": cIdx === columns.length - 1,
                          "hover:text-primary-text cursor-pointer font-semibold":
                            (!disableClick || !disableClick(row, rIdx)) &&
                            !!value(row, rIdx) &&
                            !!valueClick,
                          [className]: !!className,
                        })}
                        onClick={() =>
                          (!disableClick || !disableClick(row, rIdx)) &&
                          value(row, rIdx) &&
                          valueClick &&
                          valueClick(row, rIdx)
                        }
                      >
                        {value(row, rIdx)}
                      </td>
                    ),
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export { ReadOnlyTable };
