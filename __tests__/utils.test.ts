import { describe, it, expect } from "vitest";
import {
  stripHtml,
  formatScore,
  formatStatus,
  formatSeason,
  getMediaHref,
  getCurrentSeason,
  clampPage,
  colorToBlurDataURL,
  formatFuzzyDate,
  parseDescriptionFields,
} from "@/app/lib/utils";

// ── stripHtml ──────────────────────────────────────────────

describe("stripHtml", () => {
  it("returns empty string for null/undefined", () => {
    expect(stripHtml(null)).toBe("");
  });

  it("strips basic HTML tags", () => {
    expect(stripHtml("<p>Hello <b>world</b></p>")).toBe("Hello world");
  });

  it("replaces <br> with space", () => {
    expect(stripHtml("Line 1<br/>Line 2")).toBe("Line 1 Line 2");
  });

  it("decodes common entities", () => {
    expect(stripHtml("&amp; &lt; &gt; &quot; &#x27; &nbsp;")).toBe("& < > \" '");
  });

  it("collapses multiple spaces", () => {
    expect(stripHtml("Hello    world")).toBe("Hello world");
  });
});

// ── formatScore ────────────────────────────────────────────

describe("formatScore", () => {
  it("returns N/A for null", () => {
    expect(formatScore(null)).toBe("N/A");
  });

  it("formats 85 as 8.5", () => {
    expect(formatScore(85)).toBe("8.5");
  });

  it("formats 100 as 10.0", () => {
    expect(formatScore(100)).toBe("10.0");
  });

  it("formats 0 as 0.0", () => {
    expect(formatScore(0)).toBe("0.0");
  });
});

// ── formatStatus ───────────────────────────────────────────

describe("formatStatus", () => {
  it("returns Unknown for null", () => {
    expect(formatStatus(null)).toBe("Unknown");
  });

  it("formats RELEASING → Releasing", () => {
    expect(formatStatus("RELEASING")).toBe("Releasing");
  });

  it("formats NOT_YET_RELEASED → Not yet released", () => {
    expect(formatStatus("NOT_YET_RELEASED")).toBe("Not yet released");
  });
});

// ── formatSeason ───────────────────────────────────────────

describe("formatSeason", () => {
  it("returns TBA when both null", () => {
    expect(formatSeason(null, null)).toBe("TBA");
  });

  it("formats WINTER 2025", () => {
    expect(formatSeason("WINTER", 2025)).toBe("Winter 2025");
  });

  it("handles only year", () => {
    expect(formatSeason(null, 2024)).toBe("2024");
  });

  it("handles only season", () => {
    expect(formatSeason("SPRING", null)).toBe("Spring");
  });
});

// ── getMediaHref ───────────────────────────────────────────

describe("getMediaHref", () => {
  it("returns anime path by default", () => {
    expect(getMediaHref(123)).toBe("/anime/123");
  });

  it("returns anime path for ANIME type", () => {
    expect(getMediaHref(99, "ANIME")).toBe("/anime/99");
  });

  it("returns manga path for MANGA type", () => {
    expect(getMediaHref(42, "MANGA")).toBe("/manga/42");
  });
});

// ── getCurrentSeason ───────────────────────────────────────

describe("getCurrentSeason", () => {
  it("returns a valid season and current year", () => {
    const { season, year } = getCurrentSeason();
    expect(["WINTER", "SPRING", "SUMMER", "FALL"]).toContain(season);
    expect(year).toBeGreaterThanOrEqual(2024);
  });
});

// ── clampPage ──────────────────────────────────────────────

describe("clampPage", () => {
  it("defaults to 1 for null", () => {
    expect(clampPage(null)).toBe(1);
  });

  it("clamps negative to 1", () => {
    expect(clampPage("-5")).toBe(1);
  });

  it("clamps 0 to 1", () => {
    expect(clampPage("0")).toBe(1);
  });

  it("passes through valid page numbers", () => {
    expect(clampPage("10")).toBe(10);
  });

  it("clamps to MAX_PAGE (500)", () => {
    expect(clampPage("9999")).toBe(500);
  });

  it("handles non-numeric strings", () => {
    expect(clampPage("abc")).toBe(1);
  });
});

// ── colorToBlurDataURL ─────────────────────────────────────

describe("colorToBlurDataURL", () => {
  it("returns undefined for null/undefined", () => {
    expect(colorToBlurDataURL(null)).toBeUndefined();
    expect(colorToBlurDataURL(undefined)).toBeUndefined();
  });

  it("generates an SVG data URL from hex color", () => {
    const result = colorToBlurDataURL("#6366f1");
    expect(result).toContain("data:image/svg+xml");
    expect(result).toContain("6366f1");
  });

  it("handles hex without #", () => {
    const result = colorToBlurDataURL("ff0000");
    expect(result).toContain("ff0000");
  });
});

// ── formatFuzzyDate ────────────────────────────────────────

describe("formatFuzzyDate", () => {
  it("returns null for null input", () => {
    expect(formatFuzzyDate(null)).toBeNull();
  });

  it("formats full date", () => {
    const result = formatFuzzyDate({ year: 2024, month: 3, day: 15 });
    expect(result).toBe("March 15 2024");
  });

  it("formats year + month without day", () => {
    const result = formatFuzzyDate({ year: 2024, month: 6, day: null });
    expect(result).toBe("June 2024");
  });

  it("formats year only", () => {
    const result = formatFuzzyDate({ year: 1990, month: null, day: null });
    expect(result).toBe("1990");
  });

  it("returns null for empty date", () => {
    expect(formatFuzzyDate({ year: null, month: null, day: null })).toBeNull();
  });
});

// ── parseDescriptionFields ─────────────────────────────────

describe("parseDescriptionFields", () => {
  it("returns empty for null", () => {
    const result = parseDescriptionFields(null);
    expect(result.fields).toEqual([]);
    expect(result.bio).toBe("");
  });

  it("extracts __Key:__ Value fields", () => {
    const html = "__Birthday:__ March 31<br>__Height:__ 172 cm<br>Some bio text here";
    const result = parseDescriptionFields(html);
    expect(result.fields.length).toBeGreaterThanOrEqual(2);
    expect(result.fields[0].key).toBe("Birthday");
    expect(result.fields[0].value).toBe("March 31");
    expect(result.bio).toContain("bio text");
  });

  it("handles plain text without fields", () => {
    const result = parseDescriptionFields("Just some text with no fields.");
    expect(result.fields).toEqual([]);
    expect(result.bio).toBe("Just some text with no fields.");
  });
});
