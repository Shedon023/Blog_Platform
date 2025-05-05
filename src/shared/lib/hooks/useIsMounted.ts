import { useCallback, useEffect, useRef } from "react";

export function useIsMounted() {
  const isMounted = useRef(false); // unmounted by default
  const isMountedFunction = useCallback(() => isMounted.current, []);

  useEffect(() => {
    isMounted.current = true; // mounted

    return () => {
      isMounted.current = false; // unmounted
    };
  }, []); // run once on mount

  return isMountedFunction;
}
