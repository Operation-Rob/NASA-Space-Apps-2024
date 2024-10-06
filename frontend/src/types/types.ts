// types/types.ts
export interface Pin {
  id: number;
  lat: number;
  lng: number;
  name: string;
  loading: boolean;
  data: any; // Replace 'any' with the actual data type
  error: string | null; // Replace 'any' with the actual error type
}
