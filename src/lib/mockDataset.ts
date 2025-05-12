// Mock dataset of 100 samples, each with 100 nucleotides
export const mockDataset = Array.from({ length: 100 }, () =>
  Array.from({ length: 100 }, () => {
    const nucleotides = ["A", "T", "C", "G"];
    return nucleotides[Math.floor(Math.random() * nucleotides.length)];
  }).join("")
);
