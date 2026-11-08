type StorageKind = "local" | "session";

const getStorage = (kind: StorageKind) =>
  kind === "local" ? window.localStorage : window.sessionStorage;

export function readStorage<T>(
  key: string,
  fallback: T,
  kind: StorageKind = "local"
): T {
  try {
    const value = getStorage(kind).getItem(key);
    return value === null ? fallback : (JSON.parse(value) as T);
  } catch {
    return fallback;
  }
}

export function writeStorage(
  key: string,
  value: unknown,
  kind: StorageKind = "local"
) {
  try {
    getStorage(kind).setItem(key, JSON.stringify(value));
  } catch {}
}

export function removeStorage(key: string, kind: StorageKind = "local") {
  try {
    getStorage(kind).removeItem(key);
  } catch {}
}
