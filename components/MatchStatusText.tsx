"use client";

import SplitText from "@/components/SplitText"; 

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
  const text = percent === null ? "Loading match..." : getMatchLabel(percent);

  return (
    <SplitText
      key={text}
      text={text}
      className="justify-center text-md font-medium"
      splitType="chars"
      delay={120}
      duration={1.8}
      ease="elastic.out"
      from={{ opacity: 0, y: 12 }}
      to={{ opacity: 1, y: 0 }}
      textAlign="center"
    />
  );
}