import SimpleDialog from "@/components/dialog/SimpleDialog";
import { Button } from "@/components/ui/button";
import { type PageLink, PageTitle } from "@/routes/layouts/PageData";
import { useMemo, useState } from "react";

function Dashboard() {
  const breadcrumbs: Array<PageLink> = useMemo(
    () => [
      {
        title: "Home",
        path: "/start",
        isSeparator: false,
        isActive: false,
      },
    ],
    []
  );
  const [isCreatingSimpleDialogOpen, setIsCreatingSimpleDialogOpen] =
    useState(false);
  const [isUpdatingSimpleDialogOpen, setIsUpdatingSimpleDialogOpen] =
    useState(false);
  const [profile, setProfile] = useState<
    { name: string; email: string } | undefined
  >(undefined);

  return (
    <>
      <PageTitle breadcrumbs={breadcrumbs}>Customer</PageTitle>
      <main className="px-8 py-6">
        <h1 className="text-xl">Customer</h1>
        <Button onClick={() => setIsCreatingSimpleDialogOpen(true)}>
          New user
        </Button>
        <Button
          variant="outline"
          className="ms-2"
          onClick={() => {
            const id = String(Math.random()).slice(2, 8);
            setProfile({
              name: "user_" + id,
              email: "user_" + id + "@example.com",
            });
            setIsUpdatingSimpleDialogOpen(true);
            // setTimeout(() => {
            //   setIsUpdatingSimpleDialogOpen(true);
            // }, 100);
          }}
        >
          update user
        </Button>

        <SimpleDialog
          mode="create"
          open={isCreatingSimpleDialogOpen}
          setOpen={setIsCreatingSimpleDialogOpen}
        />
        <SimpleDialog
          mode="update"
          data={profile}
          open={isUpdatingSimpleDialogOpen}
          setOpen={setIsUpdatingSimpleDialogOpen}
        />
      </main>
    </>
  );
}

export default Dashboard;
