export const NAIL_SIZES = {
  S: [14, 10, 11, 10, 7],
  M: [15, 11, 12, 11, 8],
  L: [16, 12, 13, 12, 9],
  XL: [17, 13, 14, 13, 10]
};

export const mmToSize = (mm) => {
  const num = parseInt(mm, 10);
  if (isNaN(num)) return null;
  // This is a basic conversion, in a real app this might be more complex
  if (num <= 10) return 3;
  if (num <= 12) return 4;
  if (num <= 14) return 5;
  if (num <= 16) return 6;
  return 7;
};

export const SIZE_GUIDE_STEPS = [
  {
    title: 'Step 1: Grab Tape',
    description: 'Place a piece of clear tape across the widest part of your natural nail.'
  },
  {
    title: 'Step 2: Mark',
    description: 'Use a pen to mark the sides of your nail exactly where the nail bed meets your skin.'
  },
  {
    title: 'Step 3: Measure',
    description: 'Remove the tape and place it flat on a ruler. Measure the distance between the two marks in millimeters.'
  },
  {
    title: 'Step 4: Repeat',
    description: 'Repeat for all 10 fingers. Keep in mind your dominant hand might be slightly larger!'
  }
];
