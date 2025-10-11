// Model para pareamento de corredores
export interface RunnerMatch {
  userId: string;
  matchedUserId: string;
  matchScore: number;
  matchedAt: Date;
}
