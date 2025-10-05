import React from "react";

interface ProgressBarProps {
  label: string;
  percentage: number;
  color?: string;
  icon: React.ComponentType<any>;
  count?: number;
  total?: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  label,
  percentage,
  color = "fill-[#001F3F]", // dark navy blue
  icon: Icon,
  count,
  total,
}) => {
  const circleRadius = 50;
  const circleCircumference = 2 * Math.PI * circleRadius;
  const progressOffset = circleCircumference * (1 - percentage);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-200 flex flex-col items-center">
      {/* Header with icon and label */}
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 rounded-full bg-[#001F3F]/10">
          <Icon className="w-6 h-6 text-[#001F3F]" />
        </div>
        <div className="text-center">
          <h3 className="font-semibold text-gray-800 dark:text-gray-200">{label}</h3>
        </div>
      </div>

      {/* Circular Progress */}
      <div className="relative w-28 h-28 flex items-center justify-center mb-4">
        <svg className="transform -rotate-90 w-28 h-28">
          {/* Background circle */}
          <circle
            cx="56"
            cy="56"
            r={circleRadius}
            stroke="#E5E7EB"
            strokeWidth="8"
            fill="none"
          />
          {/* Progress circle */}
          <circle
            cx="56"
            cy="56"
            r={circleRadius}
            stroke="#001F3F" // dark navy blue
            strokeWidth="8"
            fill="none"
            strokeDasharray={circleCircumference}
            strokeDashoffset={progressOffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <span className="absolute text-xl font-bold text-[#001F3F] dark:text-white">
          {(percentage * 100).toFixed(1)}%
        </span>
      </div>
    </div>
  );
};
