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
    <div className="flex w-full flex-col gap-2 sm:flex-row sm:gap-3">
      {entries.map(({ num, text }) => {
        const selected = value === num;
        return (
          <button
            key={num}
            type="button"
            onClick={() => onChange(num)}
            className={[
              "flex min-h-13 min-w-0 flex-1 items-center justify-center rounded-xl border px-3 py-3 text-center text-sm leading-snug transition sm:px-4",
              selected
                ? "border-blue-600 bg-blue-600 text-white shadow-md shadow-blue-600/25"
                : "border-slate-200 bg-white text-slate-800 hover:border-blue-300 hover:bg-sky-50",
            ].join(" ")}
          >
            <span className="block w-full whitespace-normal break-words text-center font-medium leading-snug">
              {text}
            </span>
          </button>
        );
      })}
    </div>
  );
}
