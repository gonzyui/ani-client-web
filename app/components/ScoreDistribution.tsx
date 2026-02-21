import type { ScoreDistEntry } from "@/app/lib/types";

interface ScoreDistributionProps {
  data: ScoreDistEntry[];
}

export default function ScoreDistribution({ data }: ScoreDistributionProps) {
  if (data.length === 0) return null;

  const maxAmount = Math.max(...data.map((s) => s.amount));
  const totalVotes = data.reduce((sum, s) => sum + s.amount, 0);

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted">
        Score Distribution
      </h3>
      <div className="flex items-end gap-1.5" style={{ height: "80px" }}>
        {data.map((s) => {
          const pct = maxAmount > 0 ? (s.amount / maxAmount) * 100 : 0;
          const color =
            s.score <= 30
              ? "bg-red-500"
              : s.score <= 50
                ? "bg-orange-400"
                : s.score <= 70
                  ? "bg-yellow-400"
                  : "bg-green-500";
          return (
            <div
              key={s.score}
              className="group relative flex flex-1 flex-col items-center justify-end h-full"
            >
              <div className="absolute -top-6 hidden group-hover:block rounded bg-card-hover px-1.5 py-0.5 text-[10px] text-foreground shadow whitespace-nowrap z-10">
                {s.amount.toLocaleString()}
              </div>
              <div
                className={`w-full rounded-t ${color} transition-all duration-200 min-h-[2px]`}
                style={{ height: `${Math.max(pct, 2)}%` }}
              />
              <span className="mt-1 text-[9px] text-muted">{s.score}</span>
            </div>
          );
        })}
      </div>
      <p className="mt-2 text-center text-[10px] text-muted">
        {totalVotes.toLocaleString()} votes
      </p>
    </div>
  );
}
