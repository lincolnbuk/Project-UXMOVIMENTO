import { useState } from 'react';
import { Gamification } from '../../models/gamification/Gamification';

export function useGamificationViewModel() {
  const [data, setData] = useState<Gamification>({
    userId: '1',
    xp: 0,
    level: 1,
    points: 0,
    achievements: [],
  });

  function addXP(amount: number) {
    setData(prev => {
      const newXP = prev.xp + amount;
      const newLevel = Math.floor(newXP / 100) + 1;
      return { ...prev, xp: newXP, level: newLevel };
    });
  }

  return { data, addXP };
}
