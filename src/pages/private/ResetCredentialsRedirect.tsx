import STLogo from "@/assets/symptomtrace_logo.png";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthProvider";
import { useTheme } from "@/context/ThemeProvider";
import { supabase } from "@/lib/supabaseClient";
import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";
import { useIntl } from "react-intl";

function ResetCredentialsRedirect() {
  const { currentTheme } = useTheme();
  const { currentUser, setCurrentUser } = useAuth();
  const { formatMessage: t } = useIntl();
  const { logout, session, isLoggingOut } = useAuth();
  const hasUpdatedUser = useRef(false);

  useEffect(() => {
    const updateUser = async () => {
      if (
        session &&
        currentUser &&
        session.user.email !== currentUser.email &&
        !hasUpdatedUser.current
      ) {
        console.log(session);
        hasUpdatedUser.current = true;
        const { data } = await supabase
          .from("users")
          .update({
            email: session.user.email,
          })
          .eq("id", session.user.id)
          .select()
          .single();

        if (data) setCurrentUser(data);
      }
    };

    updateUser();
  }, [session, currentUser]);

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

        <h1 className="mt-2 mb-1 text-center text-2xl">
          Credentials have been changed
        </h1>
        <p className="text-2x mt-2 mb-4 text-center">
          You've successfully changed your credentials, please sign in again.
        </p>

        <div className="flex justify-center">
          <Button
            className="px-10"
            disabled={isLoggingOut}
            onClick={() => logout()}
          >
            {t({ id: "auth.login.title" })}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ResetCredentialsRedirect;
