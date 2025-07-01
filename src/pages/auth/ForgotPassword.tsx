import STLogo from "@/assets/symptomtrace_logo.png";
import CustomFormField from "@/components/form/CustomFormField";
import CustomLoadingButton from "@/components/form/CustomLoadingButton";
import { extractErrorMessage } from "@/components/others/ErrorLoginInfo";
import { Form } from "@/components/ui/form";
import { useTheme } from "@/context/ThemeProvider";
import { useToast } from "@/context/ToastProvider";
import { supabase } from "@/lib/supabaseClient";
import { cn } from "@/lib/utils";
import { DevTool } from "@hookform/devtools";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { useIntl } from "react-intl";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";

function ForgotPassword() {
  const { formatMessage: t } = useIntl();
  const { currentTheme } = useTheme();
  const toast = useToast();
  const navigate = useNavigate();

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
      email: "",
    },
  });

  const handleSubmit = async ({ email }: z.infer<typeof formSchema>) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-credentials`,
    });
    if (!data || error)
      return toast.error({
        title: "Failed to send the email",
        description: extractErrorMessage(error || "No response data"),
      });

    setTimeout(
      () =>
        toast.info({
          title: "Email sent",
          description:
            "A confirmation link is sent to your new email, please check your email.",
        }),
      100,
    );
    navigate("/auth/login");
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
        <p className="mt-2 mb-1 text-center text-2xl">
          {t({ id: "auth.forgotPassword.title" })}
        </p>
        <p className="text-muted-foreground mb-4 text-center">
          {t({ id: "auth.forgotPassword.subtitle" })}
        </p>
        <Form {...form}>
          <form className="mb-2" onSubmit={form.handleSubmit(handleSubmit)}>
            <CustomFormField
              required
              control={form.control}
              name="email"
              label="Email"
              type="email"
              placeholder="Enter your email"
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
        <div className="flex justify-center">
          <Link to="/auth/login" className="text-primary hover:underline">
            Back to sign in
          </Link>
        </div>
        {import.meta.env.DEV && <DevTool control={form.control} />}
      </div>
    </div>
  );
}

export default ForgotPassword;
