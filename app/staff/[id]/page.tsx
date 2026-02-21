import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { client } from "@/app/lib/client";
import { formatScore, getMediaHref, stripHtml, formatFuzzyDate } from "@/app/lib/utils";
import { STAFF_DETAIL_QUERY } from "@/app/lib/queries";
import Breadcrumbs from "@/app/components/Breadcrumbs";
import Synopsis from "@/app/components/Synopsis";
interface StaffPageProps {
  params: Promise<{ id: string }>;
}

interface RawStaffResult {
  Staff: {
    id: number;
    name: { first: string | null; middle: string | null; last: string | null; full: string | null; native: string | null };
    language: string | null;
    image: { large: string | null; medium: string | null };
    description: string | null;
    primaryOccupations: string[];
    gender: string | null;
    dateOfBirth: { year: number | null; month: number | null; day: number | null } | null;
    dateOfDeath: { year: number | null; month: number | null; day: number | null } | null;
    age: number | null;
    yearsActive: number[];
    homeTown: string | null;
    bloodType: string | null;
    favourites: number | null;
    siteUrl: string | null;
    characterMedia: {
      pageInfo: { total: number | null };
      edges: Array<{
        characterRole: string;
        characterName: string | null;
        node: {
          id: number;
          title: { romaji: string | null; english: string | null };
          type: string;
          format: string | null;
          coverImage: { large: string | null; medium: string | null };
          averageScore: number | null;
          seasonYear: number | null;
          episodes: number | null;
          chapters: number | null;
        };
        characters: Array<{
          id: number;
          name: { full: string | null };
          image: { medium: string | null };
        }>;
      }>;
    };
    staffMedia: {
      pageInfo: { total: number | null };
      edges: Array<{
        staffRole: string;
        node: {
          id: number;
          title: { romaji: string | null; english: string | null };
          type: string;
          format: string | null;
          coverImage: { large: string | null; medium: string | null };
          averageScore: number | null;
          seasonYear: number | null;
        };
      }>;
    };
  };
}

export async function generateMetadata({ params }: StaffPageProps) {
  const { id } = await params;
  try {
    const staff = await client.getStaff(parseInt(id, 10));
    return {
      title: `${staff.name.full || "Staff"} — AniClient`,
      description: stripHtml(staff.description)?.slice(0, 160) || `${staff.name.full} — voice actor, staff member`,
      openGraph: {
        title: `${staff.name.full || "Staff"} — AniClient`,
        description: stripHtml(staff.description)?.slice(0, 160) || undefined,
        images: staff.image?.large ? [{ url: staff.image.large }] : undefined,
      },
    };
  } catch {
    return { title: "Not Found — AniClient" };
  }
}

export default async function StaffPage({ params }: StaffPageProps) {
  const { id } = await params;
  const numericId = parseInt(id, 10);
  if (isNaN(numericId)) notFound();

  let data: RawStaffResult;
  try {
    data = await client.raw<RawStaffResult>(STAFF_DETAIL_QUERY, { id: numericId, page: 1, perPage: 25 });
  } catch {
    notFound();
  }

  const staff = data.Staff;
  const name = staff.name.full || "Unknown";
  const image = staff.image?.large || staff.image?.medium;
  const description = stripHtml(staff.description);
  const born = formatFuzzyDate(staff.dateOfBirth);
  const died = formatFuzzyDate(staff.dateOfDeath);

  // Deduplicate character voice roles by media
  const voiceRoles = staff.characterMedia?.edges ?? [];
  const staffRoles = staff.staffMedia?.edges ?? [];

  // Build info entries for the sidebar card
  const infoEntries: Array<{ label: string; value: string }> = [];
  if (staff.primaryOccupations?.length > 0) infoEntries.push({ label: "Occupation", value: staff.primaryOccupations.join(", ") });
  if (staff.language) infoEntries.push({ label: "Language", value: staff.language });
  if (staff.gender) infoEntries.push({ label: "Gender", value: staff.gender });
  if (born) infoEntries.push({ label: "Born", value: born });
  if (died) infoEntries.push({ label: "Died", value: died });
  if (staff.age) infoEntries.push({ label: "Age", value: String(staff.age) });
  if (staff.homeTown) infoEntries.push({ label: "Hometown", value: staff.homeTown });
  if (staff.bloodType) infoEntries.push({ label: "Blood Type", value: staff.bloodType });
  if (staff.yearsActive?.length > 0) {
    infoEntries.push({ label: "Active", value: `${staff.yearsActive[0]}${staff.yearsActive[1] ? `–${staff.yearsActive[1]}` : "–present"}` });
  }

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Staff", href: "/staff" },
          { label: name },
        ]} />

        {/* Profile Header */}
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
            <h1 className="text-2xl font-bold text-foreground sm:text-3xl md:text-4xl">{name}</h1>
            {staff.name.native && (
              <p className="text-base text-muted">{staff.name.native}</p>
            )}
            <div className="flex flex-wrap items-center gap-2">
              {staff.favourites != null && (
                <span className="score-badge flex items-center gap-1 rounded-lg bg-card px-3 py-1.5 text-sm font-bold text-score">
                  ♥ {staff.favourites.toLocaleString("en-US")}
                </span>
              )}
              {staff.primaryOccupations?.length > 0 && staff.primaryOccupations.map((occ) => (
                <span key={occ} className="rounded-lg bg-accent/20 px-3 py-1.5 text-sm font-medium text-accent-light">
                  {occ}
                </span>
              ))}
              {staff.language && (
                <span className="rounded-lg bg-card px-3 py-1.5 text-sm text-muted">
                  {staff.language}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Two-column layout: content + info sidebar */}
        <div className="mt-10 grid gap-8 lg:grid-cols-3">
          {/* Left column: About + Voice Acting + Staff Roles */}
          <div className="lg:col-span-2 space-y-10">
            {description && (
              <div>
                <h2 className="mb-3 text-lg font-semibold text-foreground">About</h2>
                <Synopsis text={description} />
              </div>
            )}

            {/* Voice Acting Roles */}
            {voiceRoles.length > 0 && (
              <section>
                <h2 className="mb-5 text-lg font-semibold text-foreground">
                  Voice Acting Roles
                  {staff.characterMedia?.pageInfo?.total && (
                    <span className="ml-2 text-sm font-normal text-muted">
                      ({staff.characterMedia.pageInfo.total})
                    </span>
                  )}
                </h2>
                <div className="space-y-3">
                  {voiceRoles.map((edge, i) => {
                    const media = edge.node;
                    const char = edge.characters?.[0];
                    const mediaTitle = media.title.english || media.title.romaji || "Unknown";
                    const mediaCover = media.coverImage?.large || media.coverImage?.medium;

                    return (
                      <div
                        key={`${media.id}-${char?.id ?? i}`}
                        className="flex items-center gap-4 rounded-xl border border-border bg-card p-3 transition-all duration-200 hover:border-accent/30"
                      >
                        <Link href={getMediaHref(media.id, media.type)} className="shrink-0">
                          {mediaCover ? (
                            <div className="relative h-16 w-11 overflow-hidden rounded-lg">
                              <Image src={mediaCover} alt={mediaTitle} fill className="object-cover" sizes="44px" />
                            </div>
                          ) : (
                            <div className="flex h-16 w-11 items-center justify-center rounded-lg bg-card-hover text-[10px] text-muted">?</div>
                          )}
                        </Link>
                        <div className="min-w-0 flex-1">
                          <Link href={getMediaHref(media.id, media.type)} className="text-sm font-medium text-foreground hover:text-accent-light">
                            {mediaTitle}
                          </Link>
                          <div className="mt-0.5 flex items-center gap-2 text-xs text-muted">
                            {media.format && <span className="uppercase">{media.format.replace(/_/g, " ")}</span>}
                            {media.seasonYear && <span>{media.seasonYear}</span>}
                            {media.averageScore && <span className="text-score">★ {formatScore(media.averageScore)}</span>}
                          </div>
                        </div>
                        {char && (
                          <Link href={`/character/${char.id}`} className="flex shrink-0 items-center gap-2">
                            <div className="text-right">
                              <p className="text-xs font-medium text-foreground">{char.name.full}</p>
                              <p className="text-[10px] capitalize text-muted">{edge.characterRole?.toLowerCase()}</p>
                            </div>
                            {char.image?.medium && (
                              <div className="relative h-12 w-12 overflow-hidden rounded-full">
                                <Image src={char.image.medium} alt={char.name.full || ""} fill className="object-cover" sizes="48px" />
                              </div>
                            )}
                          </Link>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Staff Roles */}
            {staffRoles.length > 0 && (
              <section>
                <h2 className="mb-5 text-lg font-semibold text-foreground">
                  Staff Roles
                  {staff.staffMedia?.pageInfo?.total && (
                    <span className="ml-2 text-sm font-normal text-muted">
                      ({staff.staffMedia.pageInfo.total})
                    </span>
                  )}
                </h2>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {staffRoles.map((edge, i) => {
                    const media = edge.node;
                    const mediaTitle = media.title.english || media.title.romaji || "Unknown";
                    const mediaCover = media.coverImage?.large || media.coverImage?.medium;

                    return (
                      <Link
                        key={`${media.id}-${i}`}
                        href={getMediaHref(media.id, media.type)}
                        className="group flex items-center gap-3 rounded-xl border border-border bg-card p-3 transition-all duration-200 hover:border-accent/30"
                      >
                        {mediaCover ? (
                          <div className="relative h-14 w-10 shrink-0 overflow-hidden rounded-lg">
                            <Image src={mediaCover} alt={mediaTitle} fill className="object-cover" sizes="40px" />
                          </div>
                        ) : (
                          <div className="flex h-14 w-10 shrink-0 items-center justify-center rounded-lg bg-card-hover text-[10px] text-muted">?</div>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-foreground group-hover:text-accent-light">{mediaTitle}</p>
                          <p className="mt-0.5 text-xs text-accent-light">{edge.staffRole}</p>
                          <div className="mt-0.5 flex items-center gap-2 text-[10px] text-muted">
                            {media.format && <span className="uppercase">{media.format.replace(/_/g, " ")}</span>}
                            {media.seasonYear && <span>{media.seasonYear}</span>}
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </section>
            )}
          </div>

          {/* Right column: Info card */}
          {infoEntries.length > 0 && (
            <div className="space-y-5 lg:sticky lg:top-24 lg:self-start">
              <div className="rounded-xl border border-border bg-card p-5">
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted">
                  Information
                </h3>
                <dl className="space-y-3 text-sm">
                  {infoEntries.map((item) => (
                    <div key={item.label} className="flex justify-between gap-4">
                      <dt className="shrink-0 text-muted">{item.label}</dt>
                      <dd className="text-right font-medium text-foreground">{item.value}</dd>
                    </div>
                  ))}
                </dl>
                {staff.siteUrl && (
                  <div className="mt-4 pt-3 border-t border-border">
                    <a
                      href={staff.siteUrl}
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
