import { Biomarker } from './Biomarker';

export type ConnectData = {
  connectName: string;
  connectLogo: string;
  biomarkers: Array<Biomarker>;
};
