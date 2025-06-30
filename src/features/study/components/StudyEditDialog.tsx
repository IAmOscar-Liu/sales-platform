import CustomFormField, {
  CustomFormLabel,
} from "@/components/form/CustomFormField";
import CustomLoadingButton from "@/components/form/CustomLoadingButton";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
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
  MultiSelector,
  MultiSelectorContent,
  MultiSelectorInput,
  MultiSelectorItem,
  MultiSelectorList,
  MultiSelectorTrigger,
} from "@/components/ui/multi-select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { TagsInput } from "@/components/ui/tags-input";
import { useToast } from "@/context/ToastProvider";
import { cn, waitFor } from "@/lib/utils";
import { type DialogEditProps } from "@/types/general";
import { DevTool } from "@hookform/devtools";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useIntl } from "react-intl";
import { z } from "zod";

type FormData = {
  name: string;
  startDate: Date;
  teams: string[];
  requireTraining: boolean;
  tags: string[];
  description: string;
};

const DEFAULT_FORM_VALUE: FormData = {
  name: "",
  startDate: new Date(),
  teams: [],
  requireTraining: false,
  tags: [],
  description: "",
};

function StudyEditDialog(props: DialogEditProps<FormData & { id: string }>) {
  const { mode, open, setOpen } = props;
  const data = props.mode === "update" ? props.data : undefined;
  const { formatMessage: t } = useIntl();
  const toast = useToast();

  const formSchema = useMemo(
    () =>
      z.object({
        name: z.string().min(1, t({ id: "general.validation.required" })),
        startDate: z.coerce.date(),
        teams: z
          .array(z.string())
          .min(1, { message: t({ id: "general.validation.required" }) }),
        requireTraining: z.boolean(),
        tags: z
          .array(z.string())
          .min(1, { message: t({ id: "general.validation.required" }) }),
        description: z.string(),
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
    toast.success({ title: "Study arm submitted successfully" });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        aria-describedby={undefined}
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Create New Study" : "Edit Study"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="mb-4">
              <CustomFormField
                required
                control={form.control}
                name="name"
                label="Study Name"
                placeholder="Enter name"
                fieldClassName="mb-3"
              />
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="mb-3 flex flex-col">
                    <CustomFormLabel required label="Study Start Date" />
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
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
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="teams"
                render={({ field }) => (
                  <FormItem className="mb-3">
                    <CustomFormLabel required label="Study Team" />
                    <FormControl>
                      <MultiSelector
                        values={field.value}
                        onValuesChange={(v) => {
                          field.onChange(v);
                          form.trigger(["teams"]);
                        }}
                        loop
                        className="w-full"
                      >
                        <MultiSelectorTrigger>
                          <MultiSelectorInput placeholder="Select teams" />
                        </MultiSelectorTrigger>
                        <MultiSelectorContent>
                          <MultiSelectorList>
                            <MultiSelectorItem value={"React"}>
                              React
                            </MultiSelectorItem>
                            <MultiSelectorItem value={"Vue"}>
                              Vue
                            </MultiSelectorItem>
                            <MultiSelectorItem value={"Svelte"}>
                              Svelte
                            </MultiSelectorItem>
                          </MultiSelectorList>
                        </MultiSelectorContent>
                      </MultiSelector>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <CustomFormField
                control={form.control}
                name="requireTraining"
                label="Requires AI training?"
                type="checkbox"
                fieldClassName="mb-3"
              />
              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem className="mb-3">
                    <CustomFormLabel required label="Tags" />
                    <FormControl>
                      <TagsInput
                        value={field.value}
                        onValueChange={(v) => {
                          field.onChange(v);
                          form.trigger(["tags"]);
                        }}
                        placeholder="Enter tags"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <CustomFormField
                control={form.control}
                name="description"
                type="textarea"
                label="Description about this study"
                placeholder="Enter description"
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <CustomLoadingButton
                isLoading={form.formState.isSubmitting}
                disabled={!form.formState.isValid}
              >
                Confirm
              </CustomLoadingButton>
            </DialogFooter>
          </form>
        </Form>
        {import.meta.env.DEV && <DevTool control={form.control} />}
      </DialogContent>
    </Dialog>
  );
}

export default StudyEditDialog;
