// import React from "react";

// interface ProgressBarProps {
//   label: string;
//   percentage: number;
//   color?: string;
//   icon: React.ComponentType<any>;
//   count?: number;
//   total?: number;
// }

// export const ProgressBar: React.FC<ProgressBarProps> = ({
//   label,
//   percentage,
//   color = "fill-[#001F3F]", // dark navy blue
//   icon: Icon,
//   count,
//   total,
// }) => {
//   const circleRadius = 50;
//   const circleCircumference = 2 * Math.PI * circleRadius;
//   const progressOffset = circleCircumference * (1 - percentage);

//   return (
//     <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-200 flex flex-col items-center">
//       {/* Header with icon and label */}
//       <div className="flex items-center gap-3 mb-4">
//         <div className="p-3 rounded-full bg-[#001F3F]/10">
//           <Icon className="w-6 h-6 text-[#001F3F]" />
//         </div>
//         <div className="text-center">
//           <h3 className="font-semibold text-gray-800 dark:text-gray-200">{label}</h3>
//         </div>
//       </div>

//       {/* Circular Progress */}
//       <div className="relative w-28 h-28 flex items-center justify-center mb-4">
//         <svg className="transform -rotate-90 w-28 h-28">
//           {/* Background circle */}
//           <circle
//             cx="56"
//             cy="56"
//             r={circleRadius}
//             stroke="#E5E7EB"
//             strokeWidth="8"
//             fill="none"
//           />
//           {/* Progress circle */}
//           <circle
//             cx="56"
//             cy="56"
//             r={circleRadius}
//             stroke="#001F3F" // dark navy blue
//             strokeWidth="8"
//             fill="none"
//             strokeDasharray={circleCircumference}
//             strokeDashoffset={progressOffset}
//             strokeLinecap="round"
//             className="transition-all duration-1000 ease-out"
//           />
//         </svg>
//         <span className="absolute text-xl font-bold text-[#001F3F] dark:text-white">
//           {(percentage * 100).toFixed(1)}%
//         </span>
//       </div>
//     </div>
//   );
// };

"use client"

import { cn } from "@/lib/utils"
import type { ComponentType } from "react"

type IconType = ComponentType<{ className?: string }>

interface ProgressBarProps {
  label: string
  percentage: number // 0..1
  color?: string // Tailwind bg-* class; kept to preserve original behavior
  icon?: IconType
  count?: number
  total?: number
}

export function ProgressBar({ label, percentage, color = "bg-primary", icon: Icon, count, total }: ProgressBarProps) {
  const pct = Math.max(0, Math.min(1, percentage)) * 100

  return (
    <div className="rounded-lg border-2 border-[#63e6c7] bg-card text-card-foreground p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {Icon ? <Icon className="h-4 w-4 text-muted-foreground" /> : null}
          <span className="text-sm font-medium">{label}</span>
        </div>
        <span className="text-sm font-semibold">{pct.toFixed(1)}%</span>
      </div>

      <div
        role="progressbar"
        aria-valuenow={Number(pct.toFixed(1))}
        aria-valuemin={0}
        aria-valuemax={100}
        className="h-2 w-full rounded-full bg-muted"
      >
        <div className={cn("h-2 rounded-full transition-[width] duration-500", color)} style={{ width: `${pct}%` }} />
      </div>

      {typeof count === "number" && typeof total === "number" && (
        <div className="mt-2 text-xs text-muted-foreground">
          {count} of {total} historical occurrences
        </div>
      )}
    </div>
  )
}
