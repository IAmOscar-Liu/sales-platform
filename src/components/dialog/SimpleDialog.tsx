import CustomFormField from "@/components/form/CustomFormField";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useToast } from "@/context/ToastProvider";
import { waitFor } from "@/lib/utils";
import { type DialogEditProps } from "@/types/general";
import { DevTool } from "@hookform/devtools";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useIntl } from "react-intl";
import { z } from "zod";
import CustomLoadingButton from "../form/CustomLoadingButton";

type FormData = {
  name: string;
  email: string;
};

const DEFAULT_FORM_VALUE: FormData = {
  name: "",
  email: "",
};

function SimpleDialog(props: DialogEditProps<FormData>) {
  const { mode, open, setOpen } = props;
  const data = props.mode === "update" ? props.data : undefined;
  const { formatMessage: t } = useIntl();
  const toast = useToast();

  const formSchema = useMemo(
    () =>
      z.object({
        name: z.string().min(1, t({ id: "general.validation.required" })),
        email: z
          .string()
          .min(1, t({ id: "general.validation.required" }))
          .email(t({ id: "general.validation.email" })),
      }),
    []
  );
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onTouched",
    shouldUnregister: true,
    defaultValues:
      mode === "create" ? DEFAULT_FORM_VALUE : (data ?? DEFAULT_FORM_VALUE),
  });

  useEffect(() => {
    if (!open) {
      // form.reset(undefined, { keepTouched: false, keepIsSubmitted: false });
      form.reset(DEFAULT_FORM_VALUE, { keepDefaultValues: false });
    } else if (mode === "update" && open && data) {
      form.reset(data, { keepDefaultValues: false });
    }
  }, [open]);

  const handleSubmit = async (value: FormData) => {
    console.log("Submitted:", value);
    await waitFor(1000);
    toast.success({ title: "Profile updated successfully" });
    // toast.error({ title: "Profile updated failed" });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile. Click save when you're done.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="mb-4">
              <CustomFormField
                required
                control={form.control}
                name="name"
                label="Name"
                placeholder="Enter your name"
                fieldClassName="mb-3"
              />
              <CustomFormField
                required
                control={form.control}
                name="email"
                label="Email"
                placeholder="Enter your email"
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setOpen(false)}
              >
                Close
              </Button>
              <CustomLoadingButton
                isLoading={form.formState.isSubmitting}
                disabled={!form.formState.isValid}
              >
                Save changes
              </CustomLoadingButton>
            </DialogFooter>
          </form>
        </Form>
        {import.meta.env.DEV && <DevTool control={form.control} />}
      </DialogContent>
    </Dialog>
  );
}

export default SimpleDialog;
