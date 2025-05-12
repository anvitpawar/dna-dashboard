import { mockDataset } from "./mockDataset";

// Example algorithms for each model
export const modelAlgorithms = {
  svm: () => {
    // Simulate SVM algorithm
    return { accuracy: 0.92, precision: 0.93, recall: 0.91 };
  },
  knn: () => {
    // Simulate KNN algorithm
    return { accuracy: 0.85, precision: 0.86, recall: 0.84 };
  },
  "naive-bayes": () => {
    // Simulate Naïve Bayes algorithm
    return { accuracy: 0.80, precision: 0.81, recall: 0.79 };
  },
  cnn: () => {
    // Simulate CNN algorithm
    return { accuracy: 0.95, precision: 0.96, recall: 0.94 };
  },
  lstm: () => {
    // Simulate LSTM algorithm
    return { accuracy: 0.96, precision: 0.97, recall: 0.95 };
  },
  hmm: () => {
    // Simulate HMM algorithm
    return { accuracy: 0.78, precision: 0.79, recall: 0.77 };
  },
  bayesian: () => {
    // Simulate Bayesian algorithm
    return { accuracy: 0.82, precision: 0.83, recall: 0.81 };
  },
  dbscan: () => {
    // Simulate DBSCAN algorithm
    return { accuracy: 0.75, precision: 0.76, recall: 0.74 };
  },
  hybrid: () => {
    // Simulate Hybrid (SVM+CNN+HMM) algorithm
    return { accuracy: 0.97, precision: 0.98, recall: 0.96 };
  },
};
