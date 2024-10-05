// utils/pinUtils.ts
import { Pin } from '@/types/types';

export function generateMagicString(pins: Pin[]): string {
  const jsonString = JSON.stringify(pins);
  const base64String = btoa(jsonString);
  return base64String;
}

export function loadPinsFromMagicString(magicString: string): Pin[] | null {
  try {
    const jsonString = atob(magicString);
    const pins: Pin[] = JSON.parse(jsonString);
    return pins;
  } catch (error) {
    console.error('Invalid magic string', error);
    return null;
  }
}
