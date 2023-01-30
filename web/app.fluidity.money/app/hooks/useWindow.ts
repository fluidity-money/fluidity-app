import { useEffect, useState } from "react";

const useWindow = (field: string) => {
  const [value, setValue] = useState<unknown>();

  useEffect(() => {
    setValue((window as unknown as Record<string, unknown>)[field]);
  }, [field]);

  return value;
};

export default useWindow;
