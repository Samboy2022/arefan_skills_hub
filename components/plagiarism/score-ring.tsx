import { cn } from "@/lib/utils";
import { RISK_STYLES, riskBand } from "@/lib/plagiarism";

/** Circular similarity score, coloured by risk band. */
export function ScoreRing({
  score,
  size = 56,
  stroke = 5,
  className,
  label = true,
}: {
  score: number;
  size?: number;
  stroke?: number;
  className?: string;
  label?: boolean;
}) {
  const band = RISK_STYLES[riskBand(score)];
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - Math.min(score, 100) / 100);

  return (
    <div className={cn("relative shrink-0", className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" strokeWidth={stroke} className="stroke-muted" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={cn("transition-[stroke-dashoffset] duration-700 ease-out", band.stroke)}
        />
      </svg>
      {label && (
        <span
          className={cn("absolute inset-0 flex items-center justify-center font-bold tabular-nums", band.text)}
          style={{ fontSize: Math.max(11, size * 0.26) }}
        >
          {score}%
        </span>
      )}
    </div>
  );
}
