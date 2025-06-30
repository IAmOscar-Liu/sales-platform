import { useEffect, useRef } from "react";

const useIsUnmounted = () => {
  const isUnmountedRef = useRef(false);

  useEffect(() => {
    isUnmountedRef.current = false;

    return () => {
      isUnmountedRef.current = true;
    };
  }, []);

  return isUnmountedRef.current;
};

export default useIsUnmounted;