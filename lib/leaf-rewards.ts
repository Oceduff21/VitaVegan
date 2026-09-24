import { MASCOTS, type MascotId, isMascotId } from "@/data/mascots";

export const LEAF_LEVELS = [
  { id: "seed", min: 0, titleKey: "leaf.level.seed" },
  { id: "cook", min: 100, titleKey: "leaf.level.cook" },
  { id: "chef", min: 500, titleKey: "leaf.level.chef" },
  { id: "guardian", min: 1000, titleKey: "leaf.level.guardian" },
] as const;

export type LeafLevelId = (typeof LEAF_LEVELS)[number]["id"];

export const LEAF_THEMES = [
  { id: "default", min: 0, nameKey: "leaf.theme.default", swatch: "#128a48" },
  { id: "moss", min: 100, nameKey: "leaf.theme.moss", swatch: "#1a6b3c" },
  { id: "orchard", min: 500, nameKey: "leaf.theme.orchard", swatch: "#c47820" },
  { id: "dusk", min: 1000, nameKey: "leaf.theme.dusk", swatch: "#0e5c4a" },
] as const;

export type LeafThemeId = (typeof LEAF_THEMES)[number]["id"];

export const LEAF_STICKERS = [
  { id: "none", min: 0, nameKey: "leaf.sticker.none", glyph: "·" },
  { id: "leaf", min: 100, nameKey: "leaf.sticker.leaf", glyph: "🌿" },
  { id: "sprout", min: 100, nameKey: "leaf.sticker.sprout", glyph: "🌱" },
  { id: "bloom", min: 500, nameKey: "leaf.sticker.bloom", glyph: "🌼" },
  { id: "sun", min: 500, nameKey: "leaf.sticker.sun", glyph: "☀️" },
  { id: "crown", min: 1000, nameKey: "leaf.sticker.crown", glyph: "👑" },
] as const;

export type LeafStickerId = (typeof LEAF_STICKERS)[number]["id"];

/** Food mascots unlock at Cuisinier feuille. */
export const FOOD_AVATAR_MIN = 100;

export function resolveLeafLevel(points: number) {
  let current = LEAF_LEVELS[0];
  for (const level of LEAF_LEVELS) {
    if (points >= level.min) current = level;
  }
  const idx = LEAF_LEVELS.findIndex((l) => l.id === current.id);
  const next = LEAF_LEVELS[idx + 1] ?? null;
  const progress = next
    ? Math.min(1, (points - current.min) / Math.max(1, next.min - current.min))
    : 1;
  return { current, next, progress, points };
}

export function isLeafThemeId(v: string | null | undefined): v is LeafThemeId {
  return !!v && LEAF_THEMES.some((t) => t.id === v);
}

export function isLeafStickerId(v: string | null | undefined): v is LeafStickerId {
  return !!v && LEAF_STICKERS.some((s) => s.id === v);
}

export function themeUnlocked(id: string, points: number) {
  const t = LEAF_THEMES.find((x) => x.id === id);
  return Boolean(t && points >= t.min);
}

export function stickerUnlocked(id: string, points: number) {
  const s = LEAF_STICKERS.find((x) => x.id === id);
  return Boolean(s && points >= s.min);
}

export function avatarUnlocked(avatarId: string, points: number) {
  if (!isMascotId(avatarId)) return true;
  const m = MASCOTS.find((x) => x.id === avatarId);
  if (!m || m.group === "animal") return true;
  return points >= FOOD_AVATAR_MIN;
}

export function clampCosmeticPrefs(
  input: { themeId: string; stickerId: string; avatarId: string },
  points: number,
  previous?: { themeId: string; stickerId: string; avatarId: string },
) {
  const themeId = themeUnlocked(input.themeId, points)
    ? input.themeId
    : previous && themeUnlocked(previous.themeId, points)
      ? previous.themeId
      : "default";
  const stickerId = stickerUnlocked(input.stickerId, points)
    ? input.stickerId
    : previous && stickerUnlocked(previous.stickerId, points)
      ? previous.stickerId
      : "none";
  let avatarId = input.avatarId;
  if (!avatarUnlocked(avatarId, points)) {
    if (previous && avatarUnlocked(previous.avatarId, points)) avatarId = previous.avatarId;
    else avatarId = "pip";
  }
  return {
    themeId: isLeafThemeId(themeId) ? themeId : "default",
    stickerId: isLeafStickerId(stickerId) ? stickerId : "none",
    avatarId: isMascotId(avatarId) ? (avatarId as MascotId) : "pip",
  };
}
