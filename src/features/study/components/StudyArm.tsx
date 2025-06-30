import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { EditIcon, EyeIcon, MoreVerticalIcon, PlusIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { mockStudyArms } from "../mock";
import StudyArmEditDialog from "./StudyArmEditDialog";

function StudyArm({ className }: { className?: string }) {
  const [selectedStudyArmId, setSelectedStudyArmId] = useState<
    string | undefined
  >(undefined);
  const selectedStudyArm = useMemo(() => {
    if (!selectedStudyArmId) return undefined;
    return mockStudyArms.find((arm) => arm.id === selectedStudyArmId);
  }, [selectedStudyArmId]);
  const [isCreatingStudyArmDialogOpen, setIsCreatingStudyArmDialogOpen] =
    useState(false);
  const [isUpdatingStudyArmDialogOpen, setIsUpdatingStudyArmDialogOpen] =
    useState(false);

  return (
    <div className={cn("", className)}>
      <div className="flex items-center justify-between">
        <h1 className="text-muted-foreground text-xl">Study Arm</h1>
        <Button onClick={() => setIsCreatingStudyArmDialogOpen(true)}>
          <PlusIcon />
          Create study arm
        </Button>
      </div>

      <Textarea
        disabled
        className="mt-3 resize-none"
        value={"Explanation of the survey arm"}
      />

      <StudyArmEditDialog
        mode="create"
        open={isCreatingStudyArmDialogOpen}
        setOpen={setIsCreatingStudyArmDialogOpen}
      />
      <StudyArmEditDialog
        data={selectedStudyArm}
        mode="update"
        open={isUpdatingStudyArmDialogOpen}
        setOpen={setIsUpdatingStudyArmDialogOpen}
      />

      <div className="border-border mt-3 w-full overflow-hidden rounded-md border-[1px]">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-secondary [&>th]:px-2 [&>th]:py-1 [&>th]:text-start">
              <th className="min-w-[170px]">Arm Name</th>
              <th>Description</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {mockStudyArms.map(({ id, name, description }) => (
              <tr
                key={id}
                className="not-last:border-b-border not-last:border-b-[1px] [&>td]:px-2 [&>td]:py-1"
              >
                <td>{name}</td>
                <td>{description}</td>
                <td className="w-32">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedStudyArmId(id);
                      setIsUpdatingStudyArmDialogOpen(true);
                    }}
                  >
                    <EditIcon />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <EyeIcon />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MoreVerticalIcon />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StudyArm;
