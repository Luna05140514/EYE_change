/**
 * Calculates the contact lens power based on spectacle power and vertex distance.
 * Formula: Fc = Fs / (1 - d * Fs)
 * Where:
 * Fc = Contact Lens Power
 * Fs = Spectacle Power (Diopters)
 * d = Vertex Distance (meters, typically 0.012m)
 */
export const calculateContactPower = (glassesPower: number, vertexDistanceMm: number = 12): number => {
  // If power is 0, no conversion needed
  if (glassesPower === 0) return 0;

  const vertexDistanceM = vertexDistanceMm / 1000;
  const exactPower = glassesPower / (1 - (vertexDistanceM * glassesPower));

  // Contact lenses typically come in 0.25 steps.
  // However, for higher powers, some brands only do 0.50 steps.
  // For general calculation, we stick to nearest 0.25.
  return Math.round(exactPower * 4) / 4;
};

/**
 * Formats a diopter number to a string (e.g., -5.00, +2.25)
 */
export const formatDiopter = (power: number): string => {
  if (power === 0) return "0.00";
  const sign = power > 0 ? "+" : "";
  return `${sign}${power.toFixed(2)}`;
};

/**
 * Converts traditional "degrees" (e.g., 500) to Diopters (e.g., -5.00)
 * This is a heuristic helper since users often input "500" for "-5.00".
 */
export const normalizeInputToDiopter = (input: string): number => {
  const cleanInput = input.replace(/[^\d.-]/g, '');
  let val = parseFloat(cleanInput);
  
  if (isNaN(val)) return 0;

  // Heuristic: If user types 100, 200, 500... they likely mean degrees, not Diopters.
  // Diopters rarely go above ±25.00.
  // Degrees usually imply Myopia (negative) in Asian context unless specified.
  
  // However, to be safe and accurate to the UI, we will assume the UI input is explicitly Diopters 
  // but handle the "degree" conversion if the number is suspiciously large (> 25).
  if (Math.abs(val) >= 25) {
    val = val / 100;
  }

  return val;
};