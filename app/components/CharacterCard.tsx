import type { Character } from "ani-client";
import Image from "next/image";
import Link from "next/link";
import { HeartIcon, PersonIcon } from "@/app/components/Icons";

interface CharacterCardProps {
  character: Character;
}

export default function CharacterCard({ character }: CharacterCardProps) {
  const name = character.name.full || "Unknown";
  const image = character.image?.large || character.image?.medium;

  return (
    <Link
      href={`/character/${character.id}`}
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

        {character.favourites != null && character.favourites > 0 && (
          <div className="absolute right-2 top-2 flex items-center gap-1 rounded-lg bg-card/80 px-2 py-1 text-xs font-medium text-red-400 backdrop-blur-sm">
            <HeartIcon className="h-3 w-3 fill-current" />
            {character.favourites.toLocaleString('en-US')}
          </div>
        )}
      </div>

      <div className="p-3">
        <h3 className="truncate text-sm font-semibold text-foreground">
          {name}
        </h3>
        {character.name.native && (
          <p className="mt-0.5 truncate text-xs text-muted">
            {character.name.native}
          </p>
        )}
      </div>
    </Link>
  );
}
