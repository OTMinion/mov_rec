// components/EmotionManager.tsx
"use client";

import { useState } from "react";
import { updateShowEmotions } from "@/actions/emotionActions";
import { Emotion } from "@/utils/emotionClassifier";

interface EmotionManagerProps {
  showId: string;
  currentEmotions: Emotion[];
}

export default function EmotionManager({ showId, currentEmotions }: EmotionManagerProps) {
  const [emotions, setEmotions] = useState<Emotion[]>(currentEmotions);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdate = async () => {
    setIsUpdating(true);
    const result = await updateShowEmotions(showId);
    if (result.success && result.emotions) {
      setEmotions(result.emotions);
    }
    setIsUpdating(false);
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {emotions.map((emotion) => (
          <span key={emotion} className="px-2 py-1 text-sm rounded-full bg-blue-100 text-blue-800">
            {emotion}
          </span>
        ))}
      </div>
      <button
        onClick={handleUpdate}
        disabled={isUpdating}
        className="px-4 py-2 text-sm rounded-md bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50"
      >
        {isUpdating ? "Updating..." : "Update Emotions"}
      </button>
    </div>
  );
}
