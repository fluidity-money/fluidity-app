import type { MutableRefObject } from "react";

import { useEffect } from "react";

const useClickOutside = (ref: MutableRefObject<any>, handleClick: VoidFunction) => {
  useEffect(() => {
    /**
     * Run callback if clicked on outside of element
     */
    const handleClickOutside = (event: any) => {
      if (ref.current && !ref.current.contains(event.target)) {
        handleClick();
      }
    }

    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);
};

export { useClickOutside };
