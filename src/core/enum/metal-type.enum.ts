export enum MetalType {
  GOLD = 0,
  SILVER,
  PLATINUM,
}

export const metalTypesArray = Object.keys(MetalType)
  .filter((key) => isNaN(Number(key)))
  .map((key) => ({
    name: key,
    id: MetalType[key as keyof typeof MetalType],
  }));
