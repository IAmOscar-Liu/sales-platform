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

export type DialogEditProps<T> = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
} & (
  | {
      mode: "create";
    }
  | {
      mode: "update";
      data: T | undefined | null;
    }
);
