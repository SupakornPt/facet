interface ProgressBarProps {
  value: number;
  max: number;
  label?: string;
  /** e.g. estimated time remaining */
  metaRight?: string;
}

export function ProgressBar({ value, max, label, metaRight }: ProgressBarProps) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="w-full space-y-2">
      {label ? (
        <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-app-muted">
          <span className="font-medium text-foreground">{label}</span>
          <div className="flex flex-wrap items-center justify-end gap-x-3 gap-y-1">
            <span className="font-thai-numerals text-app-subtle">
              {value} / {max}
            </span>
            {metaRight ? (
              <span className="rounded-full border border-app-primary/30 bg-app-primary/10 px-2.5 py-1 text-xs font-semibold text-app-primary">
                {metaRight}
              </span>
            ) : null}
          </div>
        </div>
      ) : null}
      <div
        className="h-2.5 w-full overflow-hidden rounded-full bg-app-border"
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label ?? "Progress"}
      >
        <div
          className="h-full rounded-full bg-app-primary transition-[width] duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
