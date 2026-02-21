import type { AiringSchedule } from "ani-client";
import { AiringSort } from "ani-client";
import { client } from "@/app/lib/client";
import PageContainer from "@/app/components/PageContainer";
import AiringCalendar from "@/app/components/AiringCalendar";

export const metadata = {
  title: "Airing Schedule",
  description:
    "Weekly anime airing schedule — see which episodes air each day this week. Never miss a new episode.",
  openGraph: {
    title: "Airing Schedule | AniClient",
    description:
      "Weekly anime airing schedule — see which episodes air each day.",
  },
};

export const revalidate = 900;

/** Build Mon→Sun date range for the current week */
function getWeekRange() {
  const now = new Date();
  const day = now.getDay(); // 0=Sun
  const diffToMon = day === 0 ? -6 : 1 - day;
  const monday = new Date(now);
  monday.setHours(0, 0, 0, 0);
  monday.setDate(monday.getDate() + diffToMon);
  const sunday = new Date(monday);
  sunday.setDate(sunday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);
  return { monday, sunday };
}

export default async function AiringPage() {
  const { monday, sunday } = getWeekRange();

  // Fetch the full week of airing episodes (paginated)
  const allEpisodes: AiringSchedule[] = [];
  let page = 1;
  let hasNext = true;
  while (hasNext && page <= 10) {
    const data = await client.getAiredEpisodes({
      airingAtGreater: Math.floor(monday.getTime() / 1000),
      airingAtLesser: Math.floor(sunday.getTime() / 1000),
      sort: [AiringSort.TIME],
      page,
      perPage: 50,
    });
    allEpisodes.push(...data.results);
    hasNext = data.pageInfo.hasNextPage ?? false;
    page++;
  }

  // Group by day-of-week (0=Mon .. 6=Sun)
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const grouped: Record<number, AiringSchedule[]> = {};
  for (let i = 0; i < 7; i++) grouped[i] = [];

  for (const ep of allEpisodes) {
    const date = new Date(ep.airingAt * 1000);
    const jsDay = date.getDay(); // 0=Sun
    const idx = jsDay === 0 ? 6 : jsDay - 1; // shift to Mon=0
    grouped[idx].push(ep);
  }

  // Deduplicate by mediaId per day (keep latest episode)
  for (let i = 0; i < 7; i++) {
    const seen = new Map<number, AiringSchedule>();
    for (const ep of grouped[i]) {
      const existing = seen.get(ep.mediaId);
      if (!existing || ep.episode > existing.episode) {
        seen.set(ep.mediaId, ep);
      }
    }
    grouped[i] = Array.from(seen.values());
  }

  const weekStart = monday.toISOString();

  return (
    <PageContainer>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Airing Schedule</h1>
        <p className="mt-2 text-muted">
          Weekly anime airing calendar — {monday.toLocaleDateString("en-US", { month: "short", day: "numeric" })} to {sunday.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
        </p>
      </div>

      <AiringCalendar days={days} grouped={grouped} weekStart={weekStart} />
    </PageContainer>
  );
}
