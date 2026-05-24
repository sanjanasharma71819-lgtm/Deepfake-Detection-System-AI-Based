import os

def load_split(root, split):
    data = []

    real_path = os.path.join(root, split, "real")
    fake_path = os.path.join(root, split, "fake")

    if not os.path.exists(real_path):
        raise FileNotFoundError(f"Missing: {real_path}")
    if not os.path.exists(fake_path):
        raise FileNotFoundError(f"Missing: {fake_path}")

    for img in os.listdir(real_path):
        if img.lower().endswith((".jpg", ".png", ".jpeg")):
            data.append((os.path.join(real_path, img), 0))

    for img in os.listdir(fake_path):
        if img.lower().endswith((".jpg", ".png", ".jpeg")):
            data.append((os.path.join(fake_path, img), 1))

    return data


def load_data(root="C:/Users/OMEN/deepfake-frontend/backend/deepfake_dataset"):

    train_data = load_split(root, "train")
    val_data = load_split(root, "validation")
    test_data = load_split(root, "test")

    print("Train samples:", len(train_data))
    print("Validation samples:", len(val_data))
    print("Test samples:", len(test_data))

    return train_data, val_data, test_data
