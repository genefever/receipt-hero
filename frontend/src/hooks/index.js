import { useState, useRef, useEffect, useCallback } from "react";

// Provides the previous props / state.
export function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

// Similar to a setState callback but for react hooks.
// sets the state and then calls the callback in the second param with updated state.
export function useStateCallback(initialState) {
  const [state, setState] = useState(initialState);
  const cbRef = useRef(null); // mutable ref to store current callback

  const setStateCallback = useCallback((state, cb) => {
    cbRef.current = cb; // store passed callback to ref
    setState(state);
  }, []);

  useEffect(() => {
    // cb.current is `null` on initial render, so we only execute cb on state *updates*
    if (cbRef.current) {
      cbRef.current(state);
      cbRef.current = null; // reset callback after execution
    }
  }, [state]);

  return [state, setStateCallback];
}

// Dynamically sets the document.title for a page.
export function useDocumentTitle(title, retainOnUnmount = false) {
  const defaultTitle = useRef(document.title);

  useEffect(() => {
    document.title = title;
  }, [title]);

  useEffect(() => {
    const defaultTitleCurrent = defaultTitle.current;
    return () => {
      if (!retainOnUnmount) {
        document.title = defaultTitleCurrent;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
