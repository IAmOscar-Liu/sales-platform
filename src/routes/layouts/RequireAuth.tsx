import { ReactNode } from "react";

export function RequireAuth(props: {
  children: ReactNode;
  acceptAuths: string[];
}) {
  return props.children;
}
