// Function to darken a hex color by a given percentage
export const darkenColor = (hex: string, percent: number): string => {
  const usePound = hex.startsWith('#');
  if (usePound) {
    hex = hex.slice(1);
  }

  // Convert 3-digit hex to 6-digit
  if (hex.length === 3) {
    hex = hex.split('').map(char => char + char).join('');
  }

  const num = parseInt(hex, 16);

  let r = (num >> 16) & 255;
  let g = (num >> 8) & 255;
  let b = num & 255;

  r = Math.round(r * (1 - percent / 100));
  g = Math.round(g * (1 - percent / 100));
  b = Math.round(b * (1 - percent / 100));

  r = Math.min(255, Math.max(0, r));
  g = Math.min(255, Math.max(0, g));
  b = Math.min(255, Math.max(0, b));

  const newHex = ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');

  return (usePound ? '#' : '') + newHex;
};
