export type BiomarkerItem = {
  bloodworkDataId: string;
  unitId: number;
  unit: string;
  healthmarker: string;
  healthMarkerId: number;
  value: string;
  status: number;
  pageNumber: number;
};

export type Bloowork = {
  userId: string;
  documentId: string;
  filename: string;
  measuredDate: Date;
  uploadedDate: Date;
  healthMarker: BiomarkerItem[];
  referralAuthority: string;
};

export type HealthMarkerUnit = {
  id: number;
  unit: string;
};

export type HealthMarker = {
  healthMarkerId: number;
  healthMarkerName: string;
  healthMarkerUnitId: number;
  healthMarkerUnit: string;
  healthMarkerMinRange: number;
  healthMarkerMaxRange: number;
};
