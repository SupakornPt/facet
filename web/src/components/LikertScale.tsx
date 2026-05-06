"use client";

interface LikertScaleProps {
  labels: Record<string, string>;
  value: number | undefined;
  onChange: (v: number) => void;
}

export function LikertScale({ labels, value, onChange }: LikertScaleProps) {
  const entries = Object.entries(labels).map(([k, v]) => ({
    num: Number(k),
    text: v,
  }));

  return (
    <div
      className="flex w-full flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:gap-3"
      role="group"
      aria-label="Response options"
    >
      {entries.map(({ num, text }) => {
        const selected = value === num;
        return (
          <button
            key={num}
            type="button"
            onClick={() => onChange(num)}
            className={[
              "flex min-h-14 min-w-0 flex-1 items-center justify-start rounded-2xl border-2 px-3 py-3.5 text-left text-sm leading-snug transition-[border-color,box-shadow,background-color,transform] duration-200 ease-out sm:min-w-[6.5rem] sm:justify-center sm:px-4 sm:text-center",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              selected
                ? "border-app-primary bg-app-primary text-app-on-primary shadow-md"
                : "border-app-border bg-app-card text-foreground hover:border-app-primary/35 hover:bg-app-primary-soft/40 active:scale-[0.99]",
            ].join(" ")}
          >
            <span className="block w-full whitespace-normal break-words font-medium leading-snug sm:text-center">
              {text}
            </span>
          </button>
        );
      })}
    </div>
  );
}
