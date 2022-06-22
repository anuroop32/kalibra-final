export type ScoreItem = {
  value: number;
  date: Date;
};

export type PillarScore = {
  id: string;
  type: string;
  name: string;
  summary: string;
  accuracy: number;
  score: number;
  currentValueIndex: number;
};
