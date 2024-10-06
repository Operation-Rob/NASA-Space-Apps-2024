// types/types.ts
export interface Pin {
  id: number;
  lat: number;
  lng: number;
  name: string;
  loading: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any; // Replace 'any' with the actual data type
  error: string | null; // Replace 'any' with the actual error type
}
