import { CognitoUser } from './CognitoUser';

export type HealthMarkerReportListItem = {
  id: string;
  reportType: string;
  assessmentName: string;
  sourceName: string;
  sourceType: string;
  measuredDate: Date;
  createdOn: Date;
  updatedOn: Date;
  user?: CognitoUser;
  createdBy: string;
  fileName?: string;
};

export type HealthMarkerReportList = {
  user: CognitoUser;
  assessments: HealthMarkerReportListItem[];
};

export type HealthMarkerReportGroup = {
  reportType: string;
  assessments: HealthMarkerReportListItem[];
};
