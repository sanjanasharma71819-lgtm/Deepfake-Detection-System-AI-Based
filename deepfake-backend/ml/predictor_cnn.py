import torch
from PIL import Image
import torchvision.transforms as transforms
from ml.cnn_model import SimpleCNN

device = torch.device("cpu")

model = None

transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor()
])


def get_model():
    global model

    if model is None:
        model = SimpleCNN().to(device)
        model.load_state_dict(
            torch.load("models/cnn.pth", map_location=device)
        )
        model.eval()

    return model


def predict_cnn(image_path):
    model = get_model()

    image = Image.open(image_path).convert("RGB")
    image = transform(image).unsqueeze(0)

    with torch.no_grad():
        output = model(image)
        prob = torch.softmax(output, dim=1)

        label = torch.argmax(prob).item()
        confidence = torch.max(prob).item()

    return {
        "label": "FAKE" if label == 1 else "REAL",
        "confidence": float(confidence)
    }