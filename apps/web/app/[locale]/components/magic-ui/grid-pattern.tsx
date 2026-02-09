"use client";

import { useId } from "react";
import { cn } from "@repo/design-system";
import wallpaper from "./wallpaper.jpg"; 

export function GridPattern({
  width = 40,
  height = 40,
  x = -1,
  y = -1,
  strokeDasharray = "10 5",
  squares,
  className,
  ...props
}: any) {
  const id = useId();

  return (
    <div 
      className="absolute inset-0 -z-20 h-full w-full overflow-hidden"
      /* This mask creates the diminishing transparency effect from top to bottom */
      style={{
        maskImage: 'linear-gradient(to bottom, white 20%, transparent 90%)',
        WebkitMaskImage: 'linear-gradient(to bottom, white 20%, transparent 90%)'
      }}
    >
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat "
        style={{ 
          backgroundImage: `url('${wallpaper.src}')`,
          zIndex: -30 
        }}
      />
      
      {/* Dark tint overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" style={{ zIndex: -25 }} />

      {/* Animated Grid SVG */}
      <svg
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0 h-full w-full stroke-white/10",
          className
        )}
        style={{ zIndex: -20 }}
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
      </svg>

      {/* Optional: Extra bottom "smoother" to blend into your site background color */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" style={{ zIndex: -10 }} />
    </div>
  );
}