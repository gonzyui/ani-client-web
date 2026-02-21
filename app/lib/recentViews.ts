/** Recent views tracking — stored in localStorage */

interface RecentItem {
  id: number;
  type: string;
  title: string;
  image: string | null;
  visitedAt: number;
}

const STORAGE_KEY = "ani-recently-viewed";
const MAX_ITEMS = 12;

export type { RecentItem };
export { STORAGE_KEY, MAX_ITEMS };

/** Track a media item as recently viewed in localStorage */
export function trackRecentView(item: Omit<RecentItem, "visitedAt">) {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const list: RecentItem[] = raw ? JSON.parse(raw) : [];
    const filtered = list.filter((r) => !(r.id === item.id && r.type === item.type));
    filtered.unshift({ ...item, visitedAt: Date.now() });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered.slice(0, MAX_ITEMS)));
  } catch {}
}

/** Read the list of recently viewed items from localStorage */
export function getRecentViews(): RecentItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/** Clear all recently viewed items */
export function clearRecentViews() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {}
}
