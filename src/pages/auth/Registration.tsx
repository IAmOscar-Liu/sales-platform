import STLogo from "@/assets/symptomtrace_logo.png";
import CustomFormField from "@/components/form/CustomFormField";
import CustomLoadingButton from "@/components/form/CustomLoadingButton";
import { extractErrorMessage } from "@/components/others/ErrorLoginInfo";
import { Form } from "@/components/ui/form";
import { useAuth } from "@/context/AuthProvider";
import { useTheme } from "@/context/ThemeProvider";
import { useToast } from "@/context/ToastProvider";
import { cn } from "@/lib/utils";
import { DevTool } from "@hookform/devtools";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { useIntl } from "react-intl";
import { Link } from "react-router-dom";
import { z } from "zod";

function Registration() {
  const { formatMessage: t } = useIntl();
  const { currentTheme } = useTheme();
  const { register } = useAuth();
  const toast = useToast();

  const formSchema = useMemo(
    () =>
      z.object({
        email: z
          .string()
          .min(1, t({ id: "general.validation.required" }))
          .email(t({ id: "general.validation.email" })),
        password: z.string().min(1, t({ id: "general.validation.required" })),
      }),
    [],
  );

  const form = useForm({
    resolver: zodResolver(formSchema),
    mode: "onTouched",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = async ({
    email,
    password,
  }: z.infer<typeof formSchema>) => {
    await register(email, password).catch((registerError) =>
      toast.error({
        title: "Registration failed",
        description: extractErrorMessage(registerError),
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
        <p className="mt-2 mb-2 text-center text-2xl">
          {t({ id: "auth.register.title" })}
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
            <CustomFormField
              required
              control={form.control}
              name="password"
              label="Password"
              type="password"
              placeholder="Enter your password"
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
            {t({ id: "auth.register.hint.signin" })}{" "}
            {t({ id: "auth.register.link.signin" })}
          </Link>
        </div>
        {import.meta.env.DEV && <DevTool control={form.control} />}
      </div>
    </div>
  );
}

export default Registration;
