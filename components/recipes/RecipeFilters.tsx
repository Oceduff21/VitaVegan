import Link from "next/link";
import { KIND_CHIPS, recipesHref, type RecipeFilterSp } from "@/lib/recipe-filters";

function Chip({ href, on, children }: { href: string; on: boolean; children: string }) {
  return (
    <Link href={href} className={`chip ${on ? "border-leaf bg-leaf/15 text-forest" : ""}`} aria-current={on ? "true" : undefined}>
      {children}
    </Link>
  );
}

export function RecipeFilters({
  sp,
  t,
}: {
  sp: RecipeFilterSp;
  t: (key: string) => string;
}) {
  const kinds = sp.cat ? KIND_CHIPS[sp.cat] : undefined;

  return (
    <div className="flex flex-col gap-2">
      {sp.cat === "apero" ? <p className="text-sm text-ink/65">{t("recipes.aperoLead")}</p> : null}
      {sp.cat === "boisson" ? <p className="text-sm text-ink/65">{t("recipes.boissonLead")}</p> : null}
      {sp.cat === "batch" ? <p className="text-sm text-ink/65">{t("recipes.batchLead")}</p> : null}
      {sp.cat === "bases" ? <p className="text-sm text-ink/65">{t("recipes.basesLead")}</p> : null}
      {kinds ? (
        <div className="flex flex-wrap gap-2" aria-label={t("recipes.filters")}>
          <Chip href={recipesHref(sp, { kind: null, q: null })} on={!sp.kind}>
            {t("recipes.filter.all")}
          </Chip>
          {kinds.map((k) => (
            <Chip key={k.id} href={recipesHref(sp, { kind: sp.kind === k.id ? null : k.id, q: null })} on={sp.kind === k.id}>
              {t(k.labelKey)}
            </Chip>
          ))}
        </div>
      ) : null}
      {sp.cat === "apero" ? (
        <div className="flex flex-wrap gap-2">
          <Chip href={recipesHref(sp, { alc: null, q: null })} on={!sp.alc}>
            {t("recipes.alcAll")}
          </Chip>
          <Chip href={recipesHref(sp, { alc: sp.alc === "0" ? null : "0", q: null })} on={sp.alc === "0"}>
            {t("recipes.alcNo")}
          </Chip>
          <Chip href={recipesHref(sp, { alc: sp.alc === "1" ? null : "1", q: null })} on={sp.alc === "1"}>
            {t("recipes.alcYes")}
          </Chip>
        </div>
      ) : null}
      <div className="flex flex-wrap gap-2">
        <Chip href={recipesHref(sp, { gf: sp.gf === "1" ? null : "1", q: null })} on={sp.gf === "1"}>
          {t("recipes.gf")}
        </Chip>
        <Chip href={recipesHref(sp, { max: sp.max === "15" ? null : "15", q: null })} on={sp.max === "15"}>
          {t("recipes.filter.15")}
        </Chip>
        <Chip href={recipesHref(sp, { max: sp.max === "20" ? null : "20", q: null })} on={sp.max === "20"}>
          {t("recipes.max20")}
        </Chip>
        <Chip href={recipesHref(sp, { max: sp.max === "30" ? null : "30", q: null })} on={sp.max === "30"}>
          {t("recipes.filter.30")}
        </Chip>
      </div>
    </div>
  );
}
