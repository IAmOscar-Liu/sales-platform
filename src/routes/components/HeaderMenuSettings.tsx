import chinaFlag from "@/assets/flags/china.svg";
import taiwanFlag from "@/assets/flags/taiwan.svg";
import usFlag from "@/assets/flags/us.svg";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthProvider";
import { useTheme } from "@/context/ThemeProvider";
import { cn } from "@/lib/utils";
import {
  CheckIcon,
  EditIcon,
  EyeIcon,
  KeyIcon,
  LanguagesIcon,
  LogOutIcon,
  MoonIcon,
  Settings2Icon,
  SettingsIcon,
  SunIcon,
  SunMoonIcon,
  UserRound,
} from "lucide-react";
import { useMemo, useState } from "react";
import { setLanguage, useLang } from "../../i18n/ADPI18nProvider";
import ProfileViewDialog from "./ProfileViewDialog";
import ProfileEditDialog from "./ProfileEditDialog";
import { useNavigate } from "react-router-dom";

function HeaderMenuSettings() {
  const { theme, setTheme } = useTheme();
  const { logout, currentUser, isLoggingOut } = useAuth();
  const navigate = useNavigate();
  const [isProfileViewDialogOpen, setIsProfileViewDialogOpen] = useState(false);
  const [isProfileEditDialogOpen, setIsProfileEditDialogOpen] = useState(false);

  const themeList = useMemo(
    () =>
      [
        { Icon: SunIcon, theme: "light" },
        { Icon: MoonIcon, theme: "dark" },
        { Icon: Settings2Icon, theme: "system" },
      ] as const,
    [],
  );
  const languageList = useMemo(
    () =>
      [
        {
          imgUrl: usFlag,
          label: "English",
          lang: "en",
        },
        {
          imgUrl: chinaFlag,
          label: "简体中文",
          lang: "zh",
        },
        {
          imgUrl: taiwanFlag,
          label: "繁體中文",
          lang: "zh-TW",
        },
      ] as const,
    [],
  );
  const profileUpdateData = useMemo(
    () =>
      currentUser
        ? {
            name: currentUser.name ?? "",
            ...(currentUser.region ? { region: currentUser.region } : {}),
            ...(currentUser.address ? { address: currentUser.address } : {}),
            ...(currentUser.phone_code
              ? { phone_code: currentUser.phone_code }
              : {}),
            ...(currentUser.phone ? { phone: currentUser.phone } : {}),
            ...(currentUser.birthday
              ? { birthday: new Date(currentUser.birthday) }
              : {}),
            ...(currentUser.bio ? { bio: currentUser.bio } : {}),
          }
        : undefined,
    [currentUser],
  );

  return (
    <>
      <ProfileViewDialog
        open={isProfileViewDialogOpen}
        setOpen={setIsProfileViewDialogOpen}
        data={currentUser ?? undefined}
      />
      <ProfileEditDialog
        mode="update"
        open={isProfileEditDialogOpen}
        setOpen={setIsProfileEditDialogOpen}
        data={profileUpdateData}
      />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <SettingsIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent sideOffset={10} align="end" className="">
          <DropdownMenuLabel>Settings</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="flex items-center gap-2">
                <UserRound className="text-foreground size-5" />
                Profile
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuItem
                    className="flex items-center gap-2"
                    onClick={() => setIsProfileViewDialogOpen(true)}
                  >
                    <EyeIcon className="text-foreground size-5" />
                    View
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="flex items-center gap-2"
                    onClick={() => setIsProfileEditDialogOpen(true)}
                  >
                    <EditIcon className="text-foreground size-5" />
                    Update
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="flex items-center gap-2">
                <SunMoonIcon className="text-foreground size-5" />
                Theme
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  {themeList.map(({ Icon, theme: itemTheme }) => (
                    <DropdownMenuItem
                      key={itemTheme}
                      className={cn("flex items-center gap-2", {
                        "bg-foreground/10 pointer-events-none":
                          theme === itemTheme,
                      })}
                      onClick={() => setTheme(itemTheme)}
                    >
                      <Icon className="text-foreground size-4" />
                      <p className="capitalize">{itemTheme}</p>
                      {theme === itemTheme && (
                        <CheckIcon className="text-foreground ms-auto size-4" />
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="flex items-center gap-2">
                <LanguagesIcon className="text-foreground size-5" />
                Languages
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  {languageList.map(({ imgUrl, label, lang }) => (
                    <DropdownMenuItem
                      key={lang}
                      className={cn("flex items-center gap-2", {
                        "bg-foreground/10 pointer-events-none":
                          useLang() === lang,
                      })}
                      onClick={() => setLanguage(lang)}
                    >
                      <img
                        className="size-4 overflow-hidden rounded-full"
                        src={imgUrl}
                        alt=""
                      />
                      {label}
                      {useLang() === lang && (
                        <CheckIcon className="text-foreground ms-auto size-4" />
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem
              className="flex items-center gap-2"
              onClick={() => navigate("change-credentials")}
            >
              <KeyIcon className="text-foreground size-5" />
              Change Credentials
            </DropdownMenuItem>
            <DropdownMenuItem
              className="flex items-center gap-2"
              onClick={() => !isLoggingOut && logout()}
            >
              <LogOutIcon className="text-foreground size-5" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

export default HeaderMenuSettings;
