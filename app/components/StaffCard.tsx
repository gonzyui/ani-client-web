import type { Staff } from "ani-client";
import Image from "next/image";
import Link from "next/link";
import { HeartIcon, PersonIcon } from "@/app/components/Icons";

interface StaffCardProps {
  staff: Staff;
}

export default function StaffCard({ staff }: StaffCardProps) {
  const name = staff.name.full || "Unknown";
  const image = staff.image?.large || staff.image?.medium;

  return (
    <Link
      href={`/staff/${staff.id}`}
      className="anime-card group overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:border-accent/40 hover:shadow-lg hover:shadow-accent/5"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-card">
        {image ? (
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted">
            <PersonIcon />
          </div>
        )}

        {staff.favourites != null && staff.favourites > 0 && (
          <div className="absolute right-2 top-2 flex items-center gap-1 rounded-lg bg-card/80 px-2 py-1 text-xs font-medium text-red-400 backdrop-blur-sm">
            <HeartIcon className="h-3 w-3 fill-current" />
            {staff.favourites.toLocaleString("en-US")}
          </div>
        )}
      </div>

      <div className="p-3">
        <h3 className="line-clamp-1 text-sm font-medium text-foreground transition-colors group-hover:text-accent-light">
          {name}
        </h3>
        {staff.primaryOccupations?.length > 0 && (
          <p className="mt-0.5 line-clamp-1 text-[11px] text-muted">
            {staff.primaryOccupations.join(", ")}
          </p>
        )}
      </div>
    </Link>
  );
}
