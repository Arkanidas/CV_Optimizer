"use client";

import SplitText from "@/components/SplitText"; 
import { PulsatingDots } from "@/components/pulsating-dots";

interface MatchStatusTextProps {
  percent: number | null; 
}

function getMatchLabel(percent: number): string {
  if (percent >= 90) return "Excellent match!";
  if (percent >= 80) return "Very good match!"; 
  if (percent >= 60) return "Good match!";
  if (percent >= 40) return "Decent match";
  return "Bad match"; 
}

export default function MatchStatusText({ percent }: MatchStatusTextProps) {

    if (percent === null) {
    return (
      <div className="flex justify-center items-center gap-0.5">
        <p className="text-md text-white/50">Loading</p>
        <PulsatingDots className="w-4 mt-2" />
      </div>
    );
  }
  const text = getMatchLabel(percent);

  return (
    <SplitText
      key={text}
      text={text}
      className="justify-center text-md font-medium"
      splitType="chars"
      delay={60}
      duration={1.8}
      ease="elastic.out"
      from={{ opacity: 0, y: 12 }}
      to={{ opacity: 1, y: 0 }}
      textAlign="center"
    />
  );
}