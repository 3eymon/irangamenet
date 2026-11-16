
import { useEffect, useState } from "react";

export default function useInc(limit: number) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const increment = limit % 5 === 0 ? 5 : limit % 2 === 0 ? 2 : 1;

    const interval = setInterval(() => {
      setValue((current) => {
        if (current >= limit) {
          clearInterval(interval);
          return current;
        }

        return Math.min(current + increment, limit);
      });
    }, 50);

    return () => clearInterval(interval);
  }, [limit]);

  return value;
}
