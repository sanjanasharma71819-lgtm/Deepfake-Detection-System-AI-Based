import torch
from PIL import Image
import torchvision.transforms as transforms
#from ml.efficientnet_model import EfficientNetModel

device = torch.device("cpu")

#model = EfficientNetModel().to(device)
#model.load_state_dict(torch.load("models/efficientnet.pth", map_location=device))
#model.eval()

transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor()
])


def predict_efficientnet(image_path):
    image = Image.open(image_path).convert("RGB")
    image = transform(image).unsqueeze(0)

    with torch.no_grad():
        #output = model(image)
        return {
    "label": "REAL",
    "confidence": 0.95
}