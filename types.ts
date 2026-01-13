export interface StudentData {
  name: string;
  age: number;
  diagnosis: string;
  diagnosisFile?: string; // Base64 string of the uploaded file
  diagnosisMimeType?: string;
  strengths: string;
  difficulties: string;
  hyperfocus: string;
}

export interface GeneratedPEI {
  content: string;
  timestamp: Date;
}

export interface HistoryRecord {
  id: string;
  timestamp: string; // ISO string for storage
  studentData: StudentData;
  content: string;
}

export enum AppStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}