import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { client } from "@/app/lib/client";
import { getMediaHref, stripHtml } from "@/app/lib/utils";

interface CharacterPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: CharacterPageProps) {
  const { id } = await params;
  try {
    const character = await client.getCharacter(parseInt(id, 10));
    return {
      title: `${character.name.full || "Character"} — AniClient`,
      description: stripHtml(character.description)?.slice(0, 160),
    };
  } catch {
    return { title: "Not Found — AniClient" };
  }
}

export default async function CharacterPage({ params }: CharacterPageProps) {
  const { id } = await params;
  const numericId = parseInt(id, 10);
  if (isNaN(numericId)) notFound();

  let character;
  try {
    character = await client.getCharacter(numericId);
  } catch {
    notFound();
  }

  const name = character.name.full || "Unknown Character";
  const image = character.image?.large || character.image?.medium;
  const description = stripHtml(character.description);

  return (
    <main className="mx-auto min-h-screen max-w-4xl px-4 py-10 sm:px-6">
      <div className="flex flex-col gap-8 sm:flex-row">
        <div className="shrink-0">
          {image ? (
            <Image
              src={image}
              alt={name}
              width={250}
              height={350}
              className="rounded-xl border-2 border-border shadow-xl"
              priority
            />
          ) : (
            <div className="flex h-[350px] w-[250px] items-center justify-center rounded-xl border-2 border-border bg-card text-muted">
              No Image
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold text-foreground">{name}</h1>
          {character.name.native && (
            <p className="text-lg text-muted">{character.name.native}</p>
          )}

          <div className="flex flex-wrap gap-2">
            {character.gender && (
              <span className="rounded-lg bg-card px-3 py-1.5 text-sm text-muted">
                {character.gender}
              </span>
            )}
            {character.age && (
              <span className="rounded-lg bg-card px-3 py-1.5 text-sm text-muted">
                Age: {character.age}
              </span>
            )}
            {character.bloodType && (
              <span className="rounded-lg bg-card px-3 py-1.5 text-sm text-muted">
                Blood: {character.bloodType}
              </span>
            )}
            {character.favourites != null && (
              <span className="score-badge rounded-lg bg-card px-3 py-1.5 text-sm font-semibold text-score">
                ♥ {character.favourites.toLocaleString('en-US')}
              </span>
            )}
          </div>

          {description && (
            <div>
              <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-muted">
                About
              </h2>
              <p className="leading-relaxed text-muted">{description}</p>
            </div>
          )}

          {character.siteUrl && (
            <a
              href={character.siteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-accent-light hover:underline"
            >
              View on AniList &rarr;
            </a>
          )}
        </div>
      </div>

      {character.media?.nodes && character.media.nodes.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-5 text-lg font-semibold text-foreground">Appears in</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {character.media.nodes.map((m) => {
              const mTitle =
                m.title.english || m.title.romaji || m.title.native || "Unknown";
              const mImage = m.coverImage?.large || m.coverImage?.medium;
              return (
                <Link
                  key={m.id}
                  href={getMediaHref(m.id, m.type)}
                  className="anime-card group overflow-hidden rounded-xl border border-border bg-card"
                >
                  <div className="relative aspect-[3/4] overflow-hidden">
                    {mImage ? (
                      <Image
                        src={mImage}
                        alt={mTitle}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 640px) 50vw, 25vw"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-card-hover text-muted">
                        No Image
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="line-clamp-2 text-sm font-medium text-foreground group-hover:text-accent-light">
                      {mTitle}
                    </p>
                    <p className="mt-1 text-xs capitalize text-muted">{m.type?.toLowerCase()}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </main>
  );
}
