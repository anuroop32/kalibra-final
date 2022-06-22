export type HealthMarkerFileUpload = {
  id: string;
  displayFilename: string;
  progressPercentage: number;
  progressText: string;
  state: 'uploaded' | 'extracting' | 'processing' | 'complete';
  status: 'success' | 'pending' | 'fail';
  fileSource: 'biomarker';
  updatedOn: Date;
  userHealthMarkerSourceId?: string;
};
