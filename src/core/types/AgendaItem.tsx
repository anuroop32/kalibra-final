export type AgendaItem = {
  id: string;
  when: Date;
  pillar: string;
  name: string;
  text: string;
  validationText: string;
  userResponded: boolean;
  userCompleted: boolean;
};

export type AgendaItemDetail = {
  id: string;
  when: Date;
  pillar: string;
  name: string;
  text: string;
  validationText: string;
  repeatFrequencyDays: number;
  durationDays: number;
};

export type AgendaItemGroup = {
  title: string;
  date?: Date;
  subTitle: string;
  data: AgendaItem[];
};
