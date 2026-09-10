import * as React from "react";

type PossibleRef<T> = React.Ref<T> | undefined;

/**
 * Merges multiple React refs (callback refs or RefObjects) into a single callback ref.
 */
export function mergeRefs<T>(...refs: PossibleRef<T>[]): React.RefCallback<T> {
  return (node: T | null) => {
    refs.forEach((ref) => {
      if (!ref) return;
      if (typeof ref === "function") {
        ref(node);
      } else if (typeof ref === "object" && "current" in ref) {
        (ref as React.MutableRefObject<T | null>).current = node;
      }
    });
  };
}

/**
 * Hook to stably merge forwardedRef and internalRef.
 */
export function useMergeRefs<T>(...refs: PossibleRef<T>[]): React.RefCallback<T> {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return React.useCallback(mergeRefs(...refs), refs);
}
