// ProgressBar.tsx
import React from "react";

interface ProgressBarProps {
  progress: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  return (
    <main
      style={{
        backdropFilter: "blur(7px)",
      }}
      className="inset-0 bg-background/90 absolute z-[99999999999] flex items-end justify-end"
    >
      <div className="w-full bg-muted h-2.5">
        <div
          className="bg-primary h-2.5 rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>
    </main>
  );
};

export default ProgressBar;
