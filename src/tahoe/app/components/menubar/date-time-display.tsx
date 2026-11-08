"use client";

import React, { useEffect, useState } from "react";

const DateTimeDisplay: React.FC = React.memo(() => {
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  useEffect(() => {
    setCurrentTime(new Date());
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  if (!currentTime) return null;

  const formattedDate = currentTime.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
  const formattedTime = currentTime.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <>
      <div className="hidden sm:block">{formattedDate.replace(",", "")}</div>
      <div>{formattedTime}</div>
    </>
  );
});

DateTimeDisplay.displayName = "DateTimeDisplay";

export default DateTimeDisplay;
