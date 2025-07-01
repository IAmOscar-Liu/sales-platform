import CustomFormField from "@/components/form/CustomFormField";
import CustomLoadingButton from "@/components/form/CustomLoadingButton";
import { extractErrorMessage } from "@/components/others/ErrorLoginInfo";
import { Form } from "@/components/ui/form";
import { useAuth } from "@/context/AuthProvider";
import { useToast } from "@/context/ToastProvider";
import { supabase } from "@/lib/supabaseClient";
import { DevTool } from "@hookform/devtools";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useIntl } from "react-intl";
import { z } from "zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

type CredentialType = "email" | "password";

function ChangeCredentials() {
  const [credentialType, setCredentialType] = useState<CredentialType>("email");

  return (
    <div className="relative flex min-h-full min-w-[600px] flex-grow flex-col items-center justify-center">
      <p className="absolute bottom-8 left-[50%] w-[max-content] translate-x-[-50%] text-sm font-thin text-neutral-400">
        &#169;2025 Symptomtrace Corp. All Rights Reserved.
      </p>
      <div className="mx-auto w-[500px]">
        <p className="mt-2 mb-5 text-center text-2xl">
          Change your email or password
        </p>

        <Tabs value={credentialType}>
          <TabsList className="bg-primary mx-auto mb-1">
            <TabsTrigger
              className={cn("min-w-30", {
                "bg-background": credentialType === "email",
              })}
              value="email"
              onClick={() => setCredentialType("email")}
            >
              Email
            </TabsTrigger>
            <TabsTrigger
              className={cn("min-w-30", {
                "bg-background": credentialType === "password",
              })}
              value="password"
              onClick={() => setCredentialType("password")}
            >
              Password
            </TabsTrigger>
          </TabsList>
          <TabsContent
            value="email"
            className="rounded-md border p-4 shadow-md"
          >
            <ChangeEmail />
          </TabsContent>
          <TabsContent
            value="password"
            className="rounded-md border p-4 shadow-md"
          >
            <ChangePassword />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function ChangeEmail({ className }: { className?: string }) {
  const { formatMessage: t } = useIntl();
  const { currentUser, logout, isLoggingOut } = useAuth();
  const toast = useToast();

  const formSchema = useMemo(
    () =>
      z.object({
        email: z
          .string()
          .min(1, t({ id: "general.validation.required" }))
          .email(t({ id: "general.validation.email" })),
      }),
    [],
  );

  const form = useForm({
    resolver: zodResolver(formSchema),
    mode: "onTouched",
    defaultValues: {
      email: currentUser?.email || "",
    },
  });
  const dirtyFields = form.formState.dirtyFields;

  const handleSubmit = async ({ email }: z.infer<typeof formSchema>) => {
    if (!currentUser) return;

    const { data, error } = await supabase.auth.updateUser(
      { email },
      { emailRedirectTo: `${window.location.origin}/reset-redirect` },
    );

    if (!data || error)
      return toast.error({
        title: "Failed to change email",
        description: extractErrorMessage(error || "No response data"),
      });
    logout(() =>
      toast.info({
        title: "Email sent",
        description:
          "A confirmation link is sent to your new email, please check your email.",
      }),
    );
  };

  return (
    <div className={cn("", className)}>
      <Form {...form}>
        <form className="mb-2" onSubmit={form.handleSubmit(handleSubmit)}>
          <CustomFormField
            required
            control={form.control}
            name="email"
            label="New email"
            placeholder="Enter your new email"
            fieldClassName="mb-3"
          />

          <div className="mt-4 flex justify-end">
            <CustomLoadingButton
              className="px-10"
              isLoading={form.formState.isSubmitting}
              disabled={
                !form.formState.isValid ||
                Object.keys(dirtyFields).length === 0 ||
                isLoggingOut
              }
            >
              {t({ id: "general.submit" })}
            </CustomLoadingButton>
          </div>
        </form>
      </Form>
      {import.meta.env.DEV && <DevTool control={form.control} />}
    </div>
  );
}

function ChangePassword({ className }: { className?: string }) {
  const { formatMessage: t } = useIntl();
  const { currentUser, logout, isLoggingOut } = useAuth();
  const toast = useToast();

  const formSchema = useMemo(
    () =>
      z
        .object({
          password: z.string().min(6, "Password must be at least 6 characters"),
          confirmPassword: z.string(),
        })
        .refine((data) => data.password === data.confirmPassword, {
          message: "Passwords must match",
          path: ["confirmPassword"],
        }),
    [],
  );

  const form = useForm({
    resolver: zodResolver(formSchema),
    mode: "onTouched",
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const handleSubmit = async ({ password }: z.infer<typeof formSchema>) => {
    if (!currentUser) return;

    const { data, error } = await supabase.auth.updateUser({ password });

    if (!data || error)
      return toast.error({
        title: "Failed to reset password",
        description: extractErrorMessage(error || "No response data"),
      });
    logout(() =>
      toast.success({
        title: "Password reset",
        description:
          "Password has been reset, please login with the new password",
      }),
    );
  };

  return (
    <div className={cn("", className)}>
      <Form {...form}>
        <form className="mb-2" onSubmit={form.handleSubmit(handleSubmit)}>
          <CustomFormField
            required
            type="password"
            control={form.control}
            name="password"
            label="New password"
            placeholder="Enter your new password"
            fieldClassName="mb-3"
          />
          <CustomFormField
            required
            type="password"
            control={form.control}
            name="confirmPassword"
            label="Confirm password"
            placeholder="Confirm your new password"
            fieldClassName="mb-3"
          />

          <div className="mt-4 flex justify-end">
            <CustomLoadingButton
              className="px-10"
              isLoading={form.formState.isSubmitting}
              disabled={!form.formState.isValid || isLoggingOut}
            >
              {t({ id: "general.submit" })}
            </CustomLoadingButton>
          </div>
        </form>
      </Form>
      {import.meta.env.DEV && <DevTool control={form.control} />}
    </div>
  );
}

export default ChangeCredentials;
