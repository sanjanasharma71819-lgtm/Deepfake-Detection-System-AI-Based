import torch
import torch.nn.functional as F
import numpy as np
import cv2
from PIL import Image
import torchvision.transforms as transforms

from ml.cnn_model import SimpleCNN


device = torch.device("cpu")

model = SimpleCNN().to(device)
model.load_state_dict(torch.load("models/cnn.pth", map_location=device))
model.eval()



features = None
gradients = None


def save_gradient(grad):
    global gradients
    gradients = grad


def forward_hook(module, input, output):
    global features
    features = output



model.conv2.register_forward_hook(forward_hook)
model.conv2.register_backward_hook(lambda m, gi, go: save_gradient(go[0]))


transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
])


def generate_heatmap(image_path):
    global features, gradients

    image = Image.open(image_path).convert("RGB")
    img_tensor = transform(image).unsqueeze(0).to(device)

    output = model(img_tensor)
    pred_class = torch.argmax(output)

    model.zero_grad()
    output[0][pred_class].backward()

    pooled_grad = torch.mean(gradients, dim=[0, 2, 3])
    features_map = features[0]

    for i in range(len(pooled_grad)):
        features_map[i] *= pooled_grad[i]

    heatmap = torch.mean(features_map, dim=0).detach().numpy()
    heatmap = np.maximum(heatmap, 0)
    heatmap /= np.max(heatmap)

    heatmap = cv2.resize(heatmap, (224, 224))
    heatmap = np.uint8(255 * heatmap)

    heatmap = cv2.applyColorMap(heatmap, cv2.COLORMAP_JET)

    img = np.array(image.resize((224, 224)))

    overlay = cv2.addWeighted(img, 0.6, heatmap, 0.4, 0)

    return overlay