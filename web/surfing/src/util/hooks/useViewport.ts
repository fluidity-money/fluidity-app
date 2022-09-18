import React from "react";
// used to detect window width
const useViewport = () => {

  const [width, setWidth] = React.useState(typeof window !== "undefined" ? window.innerWidth : 0);

  React.useEffect(() => {
    if (typeof window !== "undefined") { 
      const handleWindowResize = () => setWidth(window.innerWidth);
      window.addEventListener("resize", handleWindowResize);
      return () => window.removeEventListener("resize", handleWindowResize);
    }
  }, []);

  // Return the width so we can use it in our components
  return { width };
};

export default useViewport;

