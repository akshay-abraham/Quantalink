import { useEffect, useState } from "react";

interface BatteryManager extends EventTarget {
  level: number;
  charging: boolean;
}

export function useBattery() {
  const [battery, setBattery] = useState<{
    level: number;
    charging: boolean;
  } | null>(null);

  useEffect(() => {
    const nav = navigator as Navigator & {
      getBattery?: () => Promise<BatteryManager>;
    };
    if (!nav.getBattery) return;

    let manager: BatteryManager | undefined;
    const update = () =>
      manager &&
      setBattery({ level: manager.level, charging: manager.charging });

    nav.getBattery().then((result) => {
      manager = result;
      update();
      manager.addEventListener("levelchange", update);
      manager.addEventListener("chargingchange", update);
    });

    return () => {
      manager?.removeEventListener("levelchange", update);
      manager?.removeEventListener("chargingchange", update);
    };
  }, []);

  return battery;
}
