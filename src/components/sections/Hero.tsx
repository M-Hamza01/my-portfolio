"use client";

import { useState } from "react";
import { EditablePolaroid } from "@/components/scrapbook/EditablePolaroid";
import { Stamp } from "@/components/scrapbook/Stamp";
import { HandwrittenLabel } from "@/components/scrapbook/HandwrittenLabel";
import { Doodle } from "@/components/scrapbook/Doodle";
import { ProgressBar } from "@/components/scrapbook/ProgressBar";
import { EditableWrapper } from "@/components/admin/EditableWrapper";
import { createClient } from "@/lib/supabase/client";

interface HeroStatus {
  id: string | null;
  percent: number;
  label: string;
}

function HeroStatusForm({
  status,
  onSaved,
  close,
}: {
  status: HeroStatus;
  onSaved: (s: HeroStatus) => void;
  close: () => void;
}) {
  const [percent, setPercent] = useState(status.percent);
  const [label, setLabel] = useState(status.label);
  const [busy, setBusy] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleSave() {
    setBusy(true);
    setErrorMsg(null);
    const supabase = createClient();
    const payload = { percent, label: label.trim() };
    await supabase.from("hero_status").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    const { data, error } = await supabase.from("hero_status").insert(payload).select().single();
    setBusy(false);
    if (error || !data) return setErrorMsg(error?.message ?? "Couldn't save.");
    onSaved({ id: data.id, percent: data.percent, label: data.label });
    close();
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="mb-1 block text-xs text-(--color-ink-faint)">Progress: {percent}%</label>
        <input
          type="range"
          min={0}
          max={100}
          value={percent}
          onChange={(e) => setPercent(Number(e.target.value))}
          className="w-full"
        />
      </div>
      <div>
        <label className="mb-1 block text-xs text-(--color-ink-faint)">Status label</label>
        <input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          maxLength={40}
          className="w-full border border-(--color-paper-line) bg-white p-2 text-sm outline-none focus:border-(--color-pen-blue)"
        />
      </div>
      {errorMsg && <p className="text-xs text-(--color-stamp-red)">{errorMsg}</p>}
      <button
        type="button"
        onClick={handleSave}
        disabled={busy}
        className="self-end border border-(--color-ink) px-4 py-1.5 font-(family-name:--font-mono) text-xs uppercase hover:bg-(--color-ink) hover:text-(--color-paper) disabled:opacity-50"
      >
        {busy ? "Saving…" : "Save"}
      </button>
    </div>
  );
}

export function Hero({
  siteImages,
  heroStatus: initial,
}: {
  siteImages: Record<string, string>;
  heroStatus: HeroStatus;
}) {
  const [heroStatus, setHeroStatus] = useState(initial);

  return (
    <section id="home" className="relative mx-auto max-w-5xl px-6 pt-20 pb-24 lg:pt-28">
      <div className="grid items-center gap-12 lg:grid-cols-[1.2fr_1fr]">
        <div className="relative">
          <h1 className="font-(family-name:--font-display) text-5xl leading-[1.05] font-bold tracking-tight sm:text-6xl">
            Hamza&apos;s Lab
          </h1>
          <p className="mt-5 max-w-md font-hand text-2xl text-(--color-ink-soft)">
            Building software. Breaking software. Learning why.
          </p>

          <EditableWrapper
            label="Edit progress"
            renderEditor={(close) => (
              <HeroStatusForm status={heroStatus} onSaved={setHeroStatus} close={close} />
            )}
          >
            <div className="mt-10 max-w-xs">
              <div className="mb-1 flex items-center justify-between font-(family-name:--font-mono) text-xs text-(--color-ink-soft)">
                <span>Current status</span>
                <span>{heroStatus.percent}%</span>
              </div>
              <ProgressBar percent={heroStatus.percent} />
              <p className="mt-1 font-hand text-sm text-(--color-ink-faint)">{heroStatus.label}</p>
            </div>
          </EditableWrapper>

          <Stamp className="mt-8">Under construction</Stamp>
        </div>

        <div className="relative flex justify-center lg:justify-end">
          <EditablePolaroid
            imageKey="hero-portrait"
            defaultSrc="/hamza-profile.jpeg"
            initialSrc={siteImages["hero-portrait"]}
            alt="Hamza"
            caption="Exploring. Building. Becoming."
            width={240}
            rotate={4}
          />
          <Doodle
            name="sparkle"
            width={28}
            className="absolute -top-4 right-4 hidden text-(--color-stamp-red) sm:block"
          />
        </div>
      </div>

      <HandwrittenLabel
        as="div"
        size="sm"
        className="mt-16 max-w-xs text-(--color-ink-faint)"
      >
        scroll down, it gets messier (in a good way) ↓
      </HandwrittenLabel>
    </section>
  );
}
