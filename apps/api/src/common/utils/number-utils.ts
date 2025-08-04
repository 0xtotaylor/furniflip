export const roundToDecimalPlaces = (num: number, places: number): number => {
  return Number(Math.round(Number(num + 'e' + places)) + 'e-' + places);
};

export const randomIntBetween = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};
