import { Button } from "@/components/ui/button";
import StudyEditDialog from "@/features/study/components/StudyEditDialog";
import StudySearch from "@/features/study/components/StudySearch";
import { mockStudies } from "@/features/study/mock";
import { type PageLink, PageTitle } from "@/routes/layouts/PageData";
import { PlusIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

function Study() {
  const breadcrumbs: Array<PageLink> = useMemo(
    () => [
      {
        title: "Home",
        path: "/start",
        isSeparator: false,
        isActive: false,
      },
      {
        title: "Research",
        isSeparator: false,
        isActive: false,
      },
    ],
    []
  );
  const [isCreatingStudyDialogOpen, setIsCreatingStudyDialogOpen] =
    useState(false);

  return (
    <>
      <PageTitle breadcrumbs={breadcrumbs}>Study</PageTitle>
      <main className="bg-background mx-6 my-6 min-h-[80vh] rounded-md px-4 pt-5 pb-3 shadow-md">
        <div className="flex items-center justify-between">
          <h1 className="text-muted-foreground text-2xl">Study Management</h1>
          <Button onClick={() => setIsCreatingStudyDialogOpen(true)}>
            <PlusIcon /> New
          </Button>
        </div>

        <StudyEditDialog
          mode="create"
          open={isCreatingStudyDialogOpen}
          setOpen={setIsCreatingStudyDialogOpen}
        />

        <StudySearch className="mt-2 mb-4" />

        <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-3">
          {mockStudies.map(
            (
              { id, title, status, duration, team, description, patients },
              studyIdx
            ) => (
              <Link
                to={`/research/study/${id}`}
                key={studyIdx}
                className="border-foreground hover:bg-foreground/5 border-1 px-3 py-2"
              >
                <div className="flex items-start justify-between">
                  <h1 className="text-muted-foreground text-2xl font-bold">
                    {title}
                  </h1>
                  <p className="text-base">{status}</p>
                </div>
                <div className="mt-1 space-y-1">
                  <p>{duration}</p>
                  <p>{team}</p>
                  <p className="my-2">{description}</p>
                  <p>{patients}</p>
                </div>
              </Link>
            )
          )}
        </div>
      </main>
    </>
  );
}

export default Study;
