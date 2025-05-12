import pandas as pd
import numpy as np
from sklearn.preprocessing import LabelEncoder
from sklearn.svm import SVC
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report
from hmmlearn import hmm
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Conv1D, MaxPooling1D, Flatten, Input
from tensorflow.keras.utils import to_categorical

# ---------------------------
# Load dataset
# ---------------------------
df = pd.read_csv("combined_dna_dataset.csv")

# ---------------------------
# Encode labels
# ---------------------------
label_encoder = LabelEncoder()
df['Label'] = label_encoder.fit_transform(df['Disease_Label'])

# ---------------------------
# DNA One-hot encoding function
# ---------------------------
def one_hot_encode_seq(seq):
    mapping = {'A': [1,0,0,0], 'T': [0,1,0,0], 'G': [0,0,1,0], 'C': [0,0,0,1], 'N':[0,0,0,0]}
    return np.array([mapping.get(base, [0,0,0,0]) for base in seq])

# Prepare data
X = np.array([one_hot_encode_seq(seq) for seq in df['DNA_Sequence']])
y = df['Label'].values

# ---------------------------
# Train/Test split
# ---------------------------
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# ---------------------------
# Step 1: CNN feature extractor
# ---------------------------
cnn_model = Sequential([
    Input(shape=(100,4)),
    Conv1D(32, 3, activation='relu'),
    MaxPooling1D(2),
    Flatten()
])

cnn_model.compile(optimizer='adam', loss='categorical_crossentropy')
cnn_features_train = cnn_model.predict(X_train, verbose=0)
cnn_features_test = cnn_model.predict(X_test, verbose=0)

# ---------------------------
# Step 2: HMM on CNN features (Gaussian HMM expects 2D inputs)
# ---------------------------
hmm_model = hmm.GaussianHMM(n_components=3, covariance_type="diag", n_iter=100)
hmm_model.fit(cnn_features_train)

# Extract state probabilities as features
def get_hmm_features(hmm_model, features):
    state_seq = hmm_model.predict(features)
    state_counts = np.array([np.bincount(state_seq, minlength=hmm_model.n_components)])
    state_counts = state_counts / state_counts.sum()
    return np.repeat(state_counts, len(features), axis=0)

hmm_features_train = get_hmm_features(hmm_model, cnn_features_train)
hmm_features_test = get_hmm_features(hmm_model, cnn_features_test)

# ---------------------------
# Step 3: Combine CNN + HMM features
# ---------------------------
combined_train = np.hstack([cnn_features_train, hmm_features_train])
combined_test = np.hstack([cnn_features_test, hmm_features_test])

# ---------------------------
# Step 4: SVM Classifier
# ---------------------------
svm_model = SVC(kernel='linear', probability=True)
svm_model.fit(combined_train, y_train)

# Predict and Evaluate
y_pred = svm_model.predict(combined_test)
print(classification_report(y_test, y_pred, target_names=label_encoder.classes_))