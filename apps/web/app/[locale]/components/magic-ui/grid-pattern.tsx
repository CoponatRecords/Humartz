"use client";

import { useId } from "react";
import { cn } from "@repo/design-system";

interface GridPatternProps extends React.SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  squares?: Array<[x: number, y: number]>;
  strokeDasharray?: string;
  className?: string;
}

export function GridPattern({
  width = 40,
  height = 40,
  x = -1,
  y = -1,
  strokeDasharray = "10 5", // Default dash for the 'snake' effect
  squares,
  className,
  ...props
}: GridPatternProps) {
  const id = useId();

  return (
    <svg
      aria-hidden="true"
      // Added absolute and -z-10 here so you don't have to touch the Hero component
      className={cn(
        "pointer-events-none absolute inset-0 -z-10 h-full w-full fill-gray-400/30 stroke-gray-400/30",
        className
      )}
      {...props}
    >
      <style>{`
        @keyframes snake {
          from { stroke-dashoffset: 0; }
          to { stroke-dashoffset: -100; }
        }
        .animate-snake {
          animation: snake 20s linear infinite;
        }
      `}</style>
      <defs>
        <pattern
          id={id}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          x={x}
          y={y}
        >
          <path
            d={`M.5 ${height}V.5H${width}`}
            fill="none"
            strokeDasharray={strokeDasharray}
            className="animate-snake"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" strokeWidth={0} fill={`url(#${id})`} />
      {squares && (
        <svg x={x} y={y} className="overflow-visible">
          {squares.map(([sqX, sqY]) => (
            <rect
              strokeWidth="0"
              key={`${sqX}-${sqY}`}
              width={width - 1}
              height={height - 1}
              x={sqX * width + 1}
              y={sqY * height + 1}
            />
          ))}
        </svg>
      )}
    </svg>
  );
}