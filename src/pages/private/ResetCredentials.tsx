import STLogo from "@/assets/symptomtrace_logo.png";
import CustomFormField from "@/components/form/CustomFormField";
import CustomLoadingButton from "@/components/form/CustomLoadingButton";
import { extractErrorMessage } from "@/components/others/ErrorLoginInfo";
import { Form } from "@/components/ui/form";
import { useAuth } from "@/context/AuthProvider";
import { useTheme } from "@/context/ThemeProvider";
import { useToast } from "@/context/ToastProvider";
import { supabase } from "@/lib/supabaseClient";
import { cn } from "@/lib/utils";
import { DevTool } from "@hookform/devtools";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { useIntl } from "react-intl";
import { z } from "zod";

function ResetCredentials() {
  const { formatMessage: t } = useIntl();
  const { currentUser, logout, isLoggingOut } = useAuth();
  const { currentTheme } = useTheme();
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
    <div className="relative flex min-h-full min-w-[600px] flex-grow flex-col items-center justify-center">
      <p className="absolute bottom-8 left-[50%] w-[max-content] translate-x-[-50%] text-sm font-thin text-neutral-400">
        &#169;2025 Symptomtrace Corp. All Rights Reserved.
      </p>
      <div className="mx-auto w-[476px]">
        <div className="mb-5 w-[208px]">
          <img
            className={cn("w-full object-contain object-left", {
              invert: currentTheme === "dark",
            })}
            src={STLogo}
            alt=""
          />
        </div>
        <p className="mt-2 mb-4 text-center text-2xl">Reset your password</p>

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

            <CustomLoadingButton
              className="mt-4 w-full"
              isLoading={form.formState.isSubmitting}
              disabled={!form.formState.isValid || isLoggingOut}
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

export default ResetCredentials;
