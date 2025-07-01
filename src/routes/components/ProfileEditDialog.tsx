import CustomFormField, {
  CustomFormLabel,
} from "@/components/form/CustomFormField";
import CustomLoadingButton from "@/components/form/CustomLoadingButton";
import { extractErrorMessage } from "@/components/others/ErrorLoginInfo";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { QUERIES } from "@/constants";
import { useAuth } from "@/context/AuthProvider";
import { useToast } from "@/context/ToastProvider";
import { supabase } from "@/lib/supabaseClient";
import { cn, getLocaleDate } from "@/lib/utils";
import { type DialogEditProps } from "@/types/general";
import { DevTool } from "@hookform/devtools";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useIntl } from "react-intl";
import { z } from "zod";

type FormData = {
  name: string;
  address?: string;
  avatar_url?: string;
  bio?: string;
  birthday?: Date;
  phone?: string;
  phone_code?: string;
  region?: string;
};

const DEFAULT_FORM_VALUE: FormData = {
  address: "",
  bio: "",
  birthday: undefined,
  name: "",
  phone: "",
  phone_code: "",
  region: "",
};

function ProfileEditDialog(props: DialogEditProps<FormData>) {
  const { mode, open, setOpen } = props;
  const data = props.mode === "update" ? props.data : undefined;
  const { formatMessage: t } = useIntl();
  const toast = useToast();
  const { currentUser, setCurrentUser } = useAuth();
  const queryClient = useQueryClient();
  const [isBirthdayOpen, setIsBirthdayOpen] = useState(false);

  const formSchema = useMemo(
    () =>
      z.object({
        name: z.string().min(1, t({ id: "general.validation.required" })),
        region: z.string().optional(),
        address: z.string().optional(),
        phone_code: z.string().optional(),
        phone: z.string().optional(),
        bio: z.string().optional(),
        birthday: z.coerce.date().optional(),
      }),
    [],
  );
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onTouched",
    shouldUnregister: true,
    defaultValues:
      mode === "create" ? DEFAULT_FORM_VALUE : (data ?? DEFAULT_FORM_VALUE),
  });
  const dirtyFields = form.formState.dirtyFields;

  useEffect(() => {
    if (!open) {
      // form.reset(undefined, { keepTouched: false, keepIsSubmitted: false });
      form.reset(DEFAULT_FORM_VALUE, { keepDefaultValues: false });
    } else if (mode === "update" && open && data) {
      form.reset(data, { keepDefaultValues: false });
    }
  }, [open]);

  const handleSubmit = async ({
    name,
    region,
    address,
    phone_code,
    phone,
    bio,
    birthday,
  }: z.infer<typeof formSchema>) => {
    if (!currentUser) return;

    const { data, error } = await supabase
      .from("users")
      .update({
        ...(dirtyFields.name ? { name } : {}),
        ...(dirtyFields.region ? { region: region || null } : {}),
        ...(dirtyFields.address ? { address: address || null } : {}),
        ...(dirtyFields.phone_code ? { phone_code: phone_code || null } : {}),
        ...(dirtyFields.phone ? { phone: phone || null } : {}),
        ...(dirtyFields.birthday
          ? { birthday: birthday ? getLocaleDate(birthday) : null }
          : {}),
        ...(dirtyFields.bio ? { bio: bio || null } : {}),
      })
      .eq("id", currentUser.id)
      .select()
      .single();

    if (!data || error)
      return toast.error({
        title: "Failed to update user",
        description: extractErrorMessage(error || "No response data"),
      });

    setCurrentUser(data);
    queryClient.invalidateQueries({ queryKey: [QUERIES.salesman] });

    toast.success({ title: "Profile updated successfully" });
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
          <DialogDescription></DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="mb-4 max-h-[60vh] overflow-y-auto">
              <CustomFormField
                required
                control={form.control}
                name="name"
                label="Username"
                placeholder="Enter your username"
                fieldClassName="mb-2"
              />
              <div className="grid grid-cols-[1fr_2fr] gap-3">
                <CustomFormField
                  control={form.control}
                  name="phone_code"
                  label="Phone Code"
                  placeholder="Phone code"
                  fieldClassName="mb-2"
                />
                <CustomFormField
                  control={form.control}
                  name="phone"
                  label="Phone"
                  placeholder="Enter your phone"
                  fieldClassName="mb-2"
                />
              </div>
              <CustomFormField
                control={form.control}
                name="region"
                label="Region"
                placeholder="Enter your region"
                fieldClassName="mb-2"
              />
              <CustomFormField
                control={form.control}
                name="address"
                label="Address"
                placeholder="Enter your address"
                fieldClassName="mb-2"
              />
              <FormField
                control={form.control}
                name="birthday"
                render={({ field }) => (
                  <FormItem className="mb-2 flex flex-col">
                    <CustomFormLabel label="Birthday" />
                    <Popover
                      open={isBirthdayOpen}
                      onOpenChange={setIsBirthdayOpen}
                    >
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(d) => {
                            field.onChange(d);
                            setIsBirthdayOpen(false);
                          }}
                          captionLayout="dropdown"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <CustomFormField
                control={form.control}
                type="textarea"
                name="bio"
                label="Bio"
                placeholder="Enter your bio"
                fieldClassName="mb-2"
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
                disabled={
                  !form.formState.isValid ||
                  Object.keys(dirtyFields).length === 0
                }
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

export default ProfileEditDialog;
