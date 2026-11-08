import { useEffect, useState } from "react";

const formatBytes = (bytes: number) => {
  const units = ["bytes", "KB", "MB", "GB", "TB"];
  const exponent = Math.min(
    Math.floor(Math.log(Math.max(bytes, 1)) / Math.log(1000)),
    units.length - 1
  );
  const value = bytes / 1000 ** exponent;
  return `${exponent ? value.toFixed(1) : value} ${units[exponent]}`;
};

export function useAvailableStorage() {
  const [available, setAvailable] = useState<string | null>(null);

  useEffect(() => {
    navigator.storage
      ?.estimate()
      .then(({ quota, usage }) => {
        if (quota) setAvailable(formatBytes(quota - (usage ?? 0)));
      })
      .catch(() => undefined);
  }, []);

  return available;
}
