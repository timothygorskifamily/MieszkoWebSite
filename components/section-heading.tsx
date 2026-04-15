type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description: string;
  align?: "left" | "center";
  tone?: "default" | "light";
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  tone = "default",
}: SectionHeadingProps) {
  const alignment = align === "center" ? "mx-auto max-w-3xl items-center text-center" : "max-w-3xl";
  const titleColor = tone === "light" ? "text-stone-50" : "text-[color:var(--foreground)]";
  const bodyColor = tone === "light" ? "text-stone-300/85" : "text-[color:var(--muted)]";
  const eyebrowTone = tone === "light" ? "border-white/10 bg-white/5 text-stone-300/75" : "eyebrow";
  const eyebrowBase =
    tone === "light"
      ? "inline-flex w-fit items-center gap-2 rounded-full border px-4 py-2 text-[0.72rem] font-bold uppercase tracking-[0.3em]"
      : "";

  return (
    <div className={`flex flex-col gap-4 ${alignment}`}>
      <span className={`${eyebrowBase} ${eyebrowTone}`}>{eyebrow}</span>
      <h2 className={`font-display text-4xl leading-tight sm:text-5xl lg:text-6xl ${titleColor}`}>{title}</h2>
      <p className={`text-base leading-8 sm:text-lg ${bodyColor}`}>{description}</p>
    </div>
  );
}