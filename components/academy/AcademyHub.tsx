"use client";

import { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useI18n } from "@/components/i18n/LanguageProvider";
import { QuizClient } from "@/components/QuizClient";
import { MemoryMatchGame, ScoreGuessGame, VeganFlashGame } from "@/components/academy/MiniGames";
import { VeganGuide } from "@/components/academy/VeganGuide";
import type { QuizQuestion } from "@/data/quizzes";

const TABS = ["guide", "quiz", "flash", "score", "memory"] as const;
type Tab = (typeof TABS)[number];

function isTab(v: string | null): v is Tab {
  return !!v && (TABS as readonly string[]).includes(v);
}

export function AcademyHub({
  questions,
  playedToday,
}: {
  questions: QuizQuestion[];
  playedToday: boolean;
}) {
  const { t } = useI18n();
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const tab: Tab = isTab(sp.get("tab")) ? (sp.get("tab") as Tab) : "guide";

  const setTab = useCallback(
    (next: Tab) => {
      const params = new URLSearchParams(sp.toString());
      if (next === "guide") params.delete("tab");
      else params.set("tab", next);
      const q = params.toString();
      router.replace(q ? `${pathname}?${q}` : pathname, { scroll: false });
    },
    [pathname, router, sp],
  );

  const tabs: { id: Tab; label: string; lead: string }[] = [
    { id: "guide", label: t("academy.tab.guide"), lead: t("academy.tab.guideLead") },
    { id: "quiz", label: t("academy.tab.quiz"), lead: t("academy.tab.quizLead") },
    { id: "flash", label: t("academy.tab.flash"), lead: t("academy.tab.flashLead") },
    { id: "score", label: t("academy.tab.score"), lead: t("academy.tab.scoreLead") },
    { id: "memory", label: t("academy.tab.memory"), lead: t("academy.tab.memoryLead") },
  ];

  const current = tabs.find((x) => x.id === tab) ?? tabs[0];

  return (
    <div className="flex flex-col gap-5">
      <div className="tabs" role="tablist" aria-label={t("nav.academy")}>
        {tabs.map((x) => (
          <button
            key={x.id}
            type="button"
            role="tab"
            aria-selected={tab === x.id}
            onClick={() => setTab(x.id)}
            className={`tab ${tab === x.id ? "is-on" : ""}`}
          >
            {x.label}
          </button>
        ))}
      </div>
      <p className="text-sm text-ink/65">{current.lead}</p>
      {tab === "guide" ? <VeganGuide /> : null}
      {tab === "quiz" ? (
        <>
          <QuizClient questions={questions} canPlayMore />
          {playedToday ? <p className="text-sm text-ink/50">{t("academy.played")}</p> : null}
        </>
      ) : null}
      {tab === "flash" ? <VeganFlashGame /> : null}
      {tab === "score" ? <ScoreGuessGame /> : null}
      {tab === "memory" ? <MemoryMatchGame /> : null}
    </div>
  );
}
