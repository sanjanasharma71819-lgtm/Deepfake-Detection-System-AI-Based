import os
import gc
import torch
from PIL import Image
import torchvision.transforms as transforms
from ml.cnn_model import SimpleCNN

device = torch.device("cpu")

model = None

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, "models", "cnn.pth")

transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor()
])


def get_model():
    global model

    if model is None:

        if not os.path.exists(MODEL_PATH):
            raise FileNotFoundError(
                f"Model file not found: {MODEL_PATH}"
            )

        model = SimpleCNN()

        state_dict = torch.load(
            MODEL_PATH,
            map_location=device
        )

        model.load_state_dict(state_dict)

        model.to(device)
        model.eval()

    return model


def predict_cnn(image_path):
    model = get_model()

    image = Image.open(image_path).convert("RGB")
    image_tensor = transform(image).unsqueeze(0).to(device)

    with torch.no_grad():
        output = model(image_tensor)
        probabilities = torch.softmax(output, dim=1)

        predicted_class = torch.argmax(
            probabilities,
            dim=1
        ).item()

        confidence = torch.max(
            probabilities
        ).item()

    del image_tensor
    del output
    del probabilities
    gc.collect()

    return {
        "label": "FAKE" if predicted_class == 1 else "REAL",
        "confidence": round(float(confidence), 4)
    }