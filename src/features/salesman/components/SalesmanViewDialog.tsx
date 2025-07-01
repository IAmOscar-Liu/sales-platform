import DialogLoading from "@/components/dialog/DialogLoading";
import DataInfoContent from "@/components/others/DataInfoContent";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DialogViewProps } from "@/types/general";
import { Tables } from "@/types/supabase";

function SalesmanViewDialog({
  open,
  setOpen,
  data,
}: DialogViewProps<Tables<"users"> | undefined>) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Salesman Profile</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        <div className="mb-4">
          {!data ? (
            <DialogLoading />
          ) : (
            <div className="max-h-[60vh] overflow-y-auto">
              <DataInfoContent
                title="Username"
                value={data.name}
                contentClassName="mb-2"
              />
              <div className="grid grid-cols-[1fr_2fr] gap-3">
                <DataInfoContent
                  title="Phone Code"
                  value={data.phone_code}
                  contentClassName="mb-2"
                />
                <DataInfoContent
                  title="Phone"
                  value={data.phone}
                  contentClassName="mb-2"
                />
              </div>
              <div className="grid grid-cols-[2fr_1fr] gap-3">
                <DataInfoContent
                  title="Email"
                  value={data.email}
                  contentClassName="mb-2"
                />
                <DataInfoContent
                  title="Region"
                  value={data.region}
                  contentClassName="mb-2"
                />
              </div>
              <DataInfoContent
                title="Address"
                value={data.address}
                contentClassName="mb-2"
              />
              <DataInfoContent
                title="birthday"
                value={data.birthday}
                contentClassName="mb-2"
              />
              <DataInfoContent
                title="Bio"
                value={data.bio}
                contentClassName="min-h-15"
              />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button onClick={() => setOpen(false)}>OK</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default SalesmanViewDialog;
