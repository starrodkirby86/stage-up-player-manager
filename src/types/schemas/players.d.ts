export interface Seed {
  seedNum: number;
  phase: string;
}

export interface SimplifiedEntrant {
  id: number;
  name: string;
  prefix?: string;
  avatar?: string;
  seed: Seed;
}

export type Players = SimplifiedEntrant[];