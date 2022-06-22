import { Pillar } from './Pillar';
export type Action = {
  id: number;
  actionName: string;
  pillars?: Array<Pillar>;
  description?: string;
  status: number;
  summary?: string;
  goalTotalTimes?: number;
  goalDoneTimes?: number;
  repeatDate?: Date;
};
