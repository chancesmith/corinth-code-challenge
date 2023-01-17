export const convertCmToInches = (metric: number): number => {
  const conversion = metric * 0.393701;

  // round to 2 decimal places
  return Math.round(conversion * 100) / 100;
};

export const convertKgToLbs = (kg: number): number => {
  return Math.round(kg * 2.20462);
};
