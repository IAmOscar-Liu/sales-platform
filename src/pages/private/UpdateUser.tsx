import CustomFormField, {
  CustomFormLabel,
} from "@/components/form/CustomFormField";
import CustomLoadingButton from "@/components/form/CustomLoadingButton";
import { extractErrorMessage } from "@/components/others/ErrorLoginInfo";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import { DevTool } from "@hookform/devtools";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useIntl } from "react-intl";
import { z } from "zod";

function UpdateUser() {
  const { formatMessage: t } = useIntl();
  const { currentUser, setCurrentUser } = useAuth();
  const toast = useToast();
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

  const form = useForm({
    resolver: zodResolver(formSchema),
    mode: "onTouched",
    defaultValues: {
      name: "",
      region: "",
      address: "",
      phone_code: "",
      phone: "",
      bio: "",
      birthday: undefined,
    },
  });

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
        name,
        ...(region ? { region } : {}),
        ...(address ? { address } : {}),
        ...(phone_code ? { phone_code } : {}),
        ...(phone ? { phone } : {}),
        ...(birthday ? { birthday: getLocaleDate(birthday) } : {}),
        ...(bio ? { bio } : {}),
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
  };

  return (
    <div className="relative flex min-h-full min-w-[600px] flex-grow flex-col items-center justify-center">
      <p className="absolute bottom-8 left-[50%] w-[max-content] translate-x-[-50%] text-sm font-thin text-neutral-400">
        &#169;2025 Symptomtrace Corp. All Rights Reserved.
      </p>
      <div className="mx-auto w-[476px]">
        <p className="mt-2 mb-2 text-center text-2xl">
          Fill up your information
        </p>
        <Form {...form}>
          <form className="mb-2" onSubmit={form.handleSubmit(handleSubmit)}>
            <CustomFormField
              required
              control={form.control}
              name="name"
              label="Username"
              placeholder="Enter your username"
              fieldClassName="mb-3"
            />
            <div className="grid grid-cols-[1fr_2fr] gap-3">
              <CustomFormField
                control={form.control}
                name="phone_code"
                label="Phone Code"
                placeholder="Phone code"
                fieldClassName="mb-3"
              />
              <CustomFormField
                control={form.control}
                name="phone"
                label="Phone"
                placeholder="Enter your phone"
                fieldClassName="mb-3"
              />
            </div>
            <CustomFormField
              control={form.control}
              name="region"
              label="Region"
              placeholder="Enter your region"
              fieldClassName="mb-3"
            />
            <CustomFormField
              control={form.control}
              name="address"
              label="Address"
              placeholder="Enter your address"
              fieldClassName="mb-3"
            />
            <FormField
              control={form.control}
              name="birthday"
              render={({ field }) => (
                <FormItem className="mb-3 flex flex-col">
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
              fieldClassName="mb-3"
            />
            <CustomLoadingButton
              className="mt-4 w-full"
              isLoading={form.formState.isSubmitting}
              disabled={!form.formState.isValid}
            >
              {t({ id: "general.submit" })}
            </CustomLoadingButton>
          </form>
        </Form>
        {import.meta.env.DEV && <DevTool control={form.control} />}
      </div>
    </div>
  );
}

export default UpdateUser;
