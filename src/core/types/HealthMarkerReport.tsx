import { CognitoUser } from './CognitoUser';

export type HealthMarkerDisplayRange = {
  value: string;
  label: string;
  color: string;
  minValue: number;
  maxValue: number;
};

export type NewHealthMarkerDisplayRange = {
  healthMarkerId: number;
  rangeLabelAlt: string;
  rangeLabel: string;
  color: string;
  minimum: string;
  maximum: string;
  displayOrder: number;
};

export type HealthMarker = {
  id: number;
  key: string;
  value: string;
  displayValue: string;
  adjustedValue: number;
  type: string;
  unit: string;
  minValue: number;
  maxValue: number;
  graphCategory: any[];
  categories: HealthMarkerDisplayRange[];
  displayCategoryColor: string;
  group: string;
  groupKey: string;
  reportType: string;
  order: number;
  graphType: string;
  info: string;
  recommendation: string;
  pillar: string;
};

export type NewHealthMarker = {
  id: number;
  key: string;
  name: string;
  displayValue: string;
  unit: string;
  minValue: number;
  maxValue: number;
  measuredDate: string;
  rn: string;
  categories: NewHealthMarkerDisplayRange[];
  displayCategoryColor: string;
  reportType: string;
  graphType: string;
  info: string;
  recommendation: string;
  pillar: string;
};

export type HealthMarkerComment = {
  groupId: number;
  group: string;
  groupKey: string;
  comment: string;
  color: string;
};

export type HealthMarkerReport = {
  reportType: string;
  user: CognitoUser;
  groups: HealthMarkerGroup[];
  createdOn: Date;
  measuredDate: Date;
  assessorName: string;
  assessmentName: string;
  bodyWeight: number;
  height: number;
};

export type HealthMarkerGroup = {
  reportType: string;
  groupName: string;
  groupKey: string;
  summary: string;
  score: number;
  data: HealthMarker[];
  comment: HealthMarkerComment | undefined;
};
