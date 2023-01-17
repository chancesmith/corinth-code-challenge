import { useEffect, useState } from "react";

const LoadingText = () => {
  const [dots, setDots] = useState("");
  useEffect(() => {
    const interval = setInterval(() => {
      if (dots.length === 3) {
        setDots("");
      } else {
        setDots(dots + ".");
      }
    }, 500);
    return () => clearInterval(interval);
  }, [dots]);

  return <p>Loading{dots}</p>;
};

export default LoadingText;
