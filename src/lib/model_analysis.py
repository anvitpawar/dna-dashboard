import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.svm import SVC
from sklearn.neighbors import KNeighborsClassifier
from sklearn.naive_bayes import GaussianNB
from sklearn.metrics import accuracy_score, precision_score, recall_score
from keras.models import Sequential
from keras.layers import Dense, LSTM
from keras.utils import to_categorical

# Updated to process the predefined CSV dataset
def load_dataset_from_csv(filename="dna_dataset.csv"):
    df = pd.read_csv(filename)
    df["Encoded_Sequence"] = df["DNA_Sequence"].apply(lambda seq: ["ATCG".index(n) for n in seq])
    X = np.array(df["Encoded_Sequence"].tolist())
    y = pd.factorize(df["Disease"])[0]
    return train_test_split(X, y, test_size=0.2, random_state=42)

def encode_sequence(sequence):
    mapping = {'A': 0, 'T': 1, 'C': 2, 'G': 3}
    return [mapping[char] for char in sequence]

def svm_analysis(X_train, X_test, y_train, y_test):
    svm = SVC()
    svm.fit(X_train, y_train)
    svm_preds = svm.predict(X_test)
    return {
        'Accuracy': accuracy_score(y_test, svm_preds),
        'Precision': precision_score(y_test, svm_preds),
        'Recall': recall_score(y_test, svm_preds)
    }

def knn_analysis(X_train, X_test, y_train, y_test):
    knn = KNeighborsClassifier()
    knn.fit(X_train, y_train)
    knn_preds = knn.predict(X_test)
    return {
        'Accuracy': accuracy_score(y_test, knn_preds),
        'Precision': precision_score(y_test, knn_preds),
        'Recall': recall_score(y_test, knn_preds)
    }

def naive_bayes_analysis(X_train, X_test, y_train, y_test):
    nb = GaussianNB()
    nb.fit(X_train, y_train)
    nb_preds = nb.predict(X_test)
    return {
        'Accuracy': accuracy_score(y_test, nb_preds),
        'Precision': precision_score(y_test, nb_preds),
        'Recall': recall_score(y_test, nb_preds)
    }

def save_results_to_csv(results, filename="model_results.csv"):
    results_df = pd.DataFrame(results)
    results_df.to_csv(filename, index=False)

if __name__ == "__main__":
    # Load and preprocess dataset from CSV
    X_train, X_test, y_train, y_test = load_dataset_from_csv("dna_dataset.csv")

    # Perform analyses
    results = []
    results.append({"Model": "SVM", **svm_analysis(X_train, X_test, y_train, y_test)})
    results.append({"Model": "KNN", **knn_analysis(X_train, X_test, y_train, y_test)})
    results.append({"Model": "Naive Bayes", **naive_bayes_analysis(X_train, X_test, y_train, y_test)})

    # Save results to CSV
    save_results_to_csv(results, filename="model_results.csv")

    print("Results saved to model_results.csv")
