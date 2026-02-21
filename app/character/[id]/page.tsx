import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { client } from "@/app/lib/client";
import { getMediaHref, parseDescriptionFields, stripHtml } from "@/app/lib/utils";
import ShareButton from "@/app/components/ShareButton";
import Breadcrumbs from "@/app/components/Breadcrumbs";

interface CharacterPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: CharacterPageProps) {
  const { id } = await params;
  try {
    const character = await client.getCharacter(parseInt(id, 10));
    const name = character.name.full || "Character";
    const description = stripHtml(character.description)?.slice(0, 160) || `${name} on AniClient`;
    const image = character.image?.large || character.image?.medium;
    return {
      title: `${name} — AniClient`,
      description,
      openGraph: {
        title: `${name} — AniClient`,
        description,
        type: "website",
        ...(image && { images: [{ url: image }] }),
      },
      twitter: {
        card: "summary",
        title: `${name} — AniClient`,
        description,
        ...(image && { images: [image] }),
      },
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
  const { fields: infoFields, bio } = parseDescriptionFields(character.description);

  // Build a combined info list: API fields first, then parsed description fields
  const apiInfo: Array<{ key: string; value: string }> = [];
  if (character.gender) apiInfo.push({ key: "Gender", value: character.gender });
  if (character.age) apiInfo.push({ key: "Age", value: character.age });
  if (character.dateOfBirth) {
    const dob = character.dateOfBirth;
    const parts = [dob.month, dob.day, dob.year].filter(Boolean);
    if (parts.length) apiInfo.push({ key: "Birthday", value: parts.join("/") });
  }
  if (character.bloodType) apiInfo.push({ key: "Blood Type", value: character.bloodType });

  // Merge: API info + parsed fields (skip duplicates from parsed if API already has them)
  const apiKeys = new Set(apiInfo.map((f) => f.key.toLowerCase()));
  const allInfo = [
    ...apiInfo,
    ...infoFields.filter((f) => !apiKeys.has(f.key.toLowerCase())),
  ];

  const mediaNodes = character.media?.nodes ?? [];

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Characters", href: "/characters" },
          { label: name },
        ]} />
        {/* Header: image + name + badges */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
          <div className="shrink-0">
            {image ? (
              <Image
                src={image}
                alt={name}
                width={220}
                height={310}
                className="rounded-xl border-2 border-border shadow-xl"
                priority
              />
            ) : (
              <div className="flex h-[310px] w-[220px] items-center justify-center rounded-xl border-2 border-border bg-card text-muted">
                No Image
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <h1 className="text-2xl font-bold text-foreground sm:text-3xl md:text-4xl">
              {name}
            </h1>
            {character.name.native && (
              <p className="text-base text-muted">{character.name.native}</p>
            )}
            <div className="flex flex-wrap items-center gap-2">
              {character.favourites != null && (
                <span className="score-badge flex items-center gap-1 rounded-lg bg-card px-3 py-1.5 text-sm font-bold text-score">
                  ♥ {character.favourites.toLocaleString("en-US")}
                </span>
              )}
              {character.gender && (
                <span className="rounded-lg bg-card px-3 py-1.5 text-sm text-muted">
                  {character.gender}
                </span>
              )}
              {character.age && (
                <span className="rounded-lg bg-card px-3 py-1.5 text-sm text-muted">
                  Age {character.age}
                </span>
              )}
              <ShareButton title={name} text={bio || undefined} />
            </div>
          </div>
        </div>

        {/* Two-column layout: bio + info sidebar */}
        <div className="mt-10 grid gap-8 lg:grid-cols-3">
          {/* Left column: About + Appears in */}
          <div className="lg:col-span-2 space-y-10">
            {bio && (
              <div>
                <h2 className="mb-3 text-lg font-semibold text-foreground">About</h2>
                <p className="leading-relaxed text-muted">{bio}</p>
              </div>
            )}

            {mediaNodes.length > 0 && (
              <section>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-foreground">Appears in</h2>
                  {mediaNodes.length > 4 && character.siteUrl && (
                    <a
                      href={character.siteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-medium text-accent-light hover:underline"
                    >
                      View all &rarr;
                    </a>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {mediaNodes.slice(0, 4).map((m) => {
                    const mTitle = m.title.english || m.title.romaji || m.title.native || "Unknown";
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
                          <p className="mt-1 text-xs capitalize text-muted">
                            {m.type?.toLowerCase()}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </section>
            )}
          </div>

          {/* Right column: Info card */}
          {allInfo.length > 0 && (
            <div className="space-y-5 lg:sticky lg:top-24 lg:self-start">
              <div className="rounded-xl border border-border bg-card p-5">
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted">
                  Information
                </h3>
                <dl className="space-y-3 text-sm">
                  {allInfo.map((item) => (
                    <div key={item.key} className="flex justify-between gap-4">
                      <dt className="shrink-0 text-muted">{item.key}</dt>
                      <dd className="text-right font-medium text-foreground">{item.value}</dd>
                    </div>
                  ))}
                </dl>
                {character.siteUrl && (
                  <div className="mt-4 pt-3 border-t border-border">
                    <a
                      href={character.siteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm text-accent-light hover:underline"
                    >
                      View on AniList &rarr;
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="h-16" />
    </main>
  );
}
