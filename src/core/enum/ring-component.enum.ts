import { RingComponentZoneArrayModel } from "../models/ringComponentZone.interface";

export enum RingComponentZone {
  CENTER = 'ZONE_CENTER',
  SHANK = 'ZONE_SHANK',
  HALO = 'ZONE_HALO',
  ACCENT = 'ZONE_ACCENT',
  GALLERY = 'ZONE_GALLERY',
}

export const RingComponentZoneArray = (): RingComponentZoneArrayModel[] => {
  return Object.entries(RingComponentZone).map(([value, key]) => ({
    key,
    value: value as keyof typeof RingComponentZone,
  }));
};

export const RING_SIZES = [
  3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5,
  8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 12.5, 13
] as const;

export type RingSize = typeof RING_SIZES[number];