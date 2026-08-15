import os
import gc
import torch
import torch.nn.functional as F
import numpy as np
import cv2
from PIL import Image
import torchvision.transforms as transforms
import base64

from ml.cnn_model import SimpleCNN

device = torch.device("cpu")

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, "models", "cnn.pth")

# ── Model ────────────────────────────────────────────────────────────────────
_model = None

def _get_model():
    global _model
    if _model is None:
        if not os.path.exists(MODEL_PATH):
            raise FileNotFoundError(f"CNN model not found: {MODEL_PATH}")
        _model = SimpleCNN()
        _model.load_state_dict(torch.load(MODEL_PATH, map_location=device))
        _model.to(device)
        _model.eval()
    return _model


# ── Transform ────────────────────────────────────────────────────────────────
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
])


# ── Grad-CAM ─────────────────────────────────────────────────────────────────
def generate_heatmap(image_path: str) -> str:
    """
    Run Grad-CAM on the given image using the last conv block of SimpleCNN.
    Returns a base64-encoded PNG data URI string.

    SimpleCNN.features layout:
      [0] Conv2d(3→32)   [1] ReLU  [2] MaxPool2d
      [3] Conv2d(32→64)  [4] ReLU  [5] MaxPool2d
      [6] Conv2d(64→128) [7] ReLU  [8] MaxPool2d

    We hook onto features[6] (the last Conv layer before the final pool).
    """
    model = _get_model()

    # Storage for forward activations and backward gradients
    captured_features = {}
    captured_gradients = {}

    # Register hooks on the last conv layer (features[6])
    target_layer = model.features[6]

    def forward_hook(module, input, output):
        captured_features["value"] = output

    def backward_hook(module, grad_input, grad_output):
        captured_gradients["value"] = grad_output[0]

    fwd_handle = target_layer.register_forward_hook(forward_hook)
    bwd_handle = target_layer.register_backward_hook(backward_hook)

    try:
        image = Image.open(image_path).convert("RGB")
        img_tensor = transform(image).unsqueeze(0).to(device)
        img_tensor.requires_grad_(True)

        output = model(img_tensor)
        pred_class = torch.argmax(output, dim=1).item()

        model.zero_grad()
        output[0][pred_class].backward()

        # Pool gradients across spatial dims
        gradients = captured_gradients["value"]  # shape: (1, C, H, W)
        pooled_grad = torch.mean(gradients, dim=[0, 2, 3])  # shape: (C,)

        features_map = captured_features["value"][0]  # shape: (C, H, W)

        # Weight each feature map channel by its pooled gradient
        for i in range(pooled_grad.shape[0]):
            features_map[i] *= pooled_grad[i]

        heatmap = torch.mean(features_map, dim=0).detach().cpu().numpy()
        heatmap = np.maximum(heatmap, 0)

        max_val = np.max(heatmap)
        if max_val > 0:
            heatmap /= max_val

        # Resize and colorise
        heatmap_resized = cv2.resize(heatmap, (224, 224))
        heatmap_uint8 = np.uint8(255 * heatmap_resized)
        heatmap_colored = cv2.applyColorMap(heatmap_uint8, cv2.COLORMAP_JET)

        # Overlay on original image
        img_np = np.array(image.resize((224, 224)))  # RGB
        img_bgr = cv2.cvtColor(img_np, cv2.COLOR_RGB2BGR)
        overlay = cv2.addWeighted(img_bgr, 0.6, heatmap_colored, 0.4, 0)

        # Encode as base64 PNG
        success, buffer = cv2.imencode(".png", overlay)
        if not success:
            raise RuntimeError("Failed to encode heatmap as PNG")

        b64 = base64.b64encode(buffer).decode("utf-8")
        return f"data:image/png;base64,{b64}"

    finally:
        fwd_handle.remove()
        bwd_handle.remove()
        gc.collect()