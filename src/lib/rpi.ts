export const computeRpi = (s: number, o: number, d: number) => s * o * d;

export const band = (rpi: number) =>
  rpi >= 120 ? "red" : rpi >= 80 ? "orange" : "green";
