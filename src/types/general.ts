import { type Dispatch, type SetStateAction } from "react";

export interface AuthSettings {
  rememberMe?: boolean;
  email?: string;
  password?: string;
  companyId?: string;
}

export type NonNullableFields<T> = {
  [K in keyof T]: NonNullable<T[K]>;
};

export type DialogBasicProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export type DialogViewProps<T> = DialogBasicProps & { data: T };

export type DialogEditProps<T> = DialogBasicProps &
  (
    | {
        mode: "create";
      }
    | {
        mode: "update";
        data: T | undefined | null;
      }
  );
