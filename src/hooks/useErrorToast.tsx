import { extractErrorMessage } from "@/components/others/ErrorLoginInfo";
import { useToast } from "@/context/ToastProvider";
import { useEffect } from "react";

function useErrorToast(error: any) {
  const toast = useToast();

  useEffect(() => {
    if (error)
      toast.error({
        title: "Failed fetching data",
        description: extractErrorMessage(error),
      });
  }, [error, toast]);
}

export default useErrorToast;
