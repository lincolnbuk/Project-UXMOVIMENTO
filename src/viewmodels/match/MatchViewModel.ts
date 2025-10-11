import { useState } from 'react';
import { RunnerMatch } from '../../models/match/RunnerMatch';

export function useMatchViewModel() {
  const [matches, setMatches] = useState<RunnerMatch[]>([]);

  // Simula pareamento
  function findMatch() {
    setMatches([
      {
        userId: '1',
        matchedUserId: '2',
        matchScore: 95,
        matchedAt: new Date(),
      },
    ]);
  }

  return { matches, findMatch };
}
