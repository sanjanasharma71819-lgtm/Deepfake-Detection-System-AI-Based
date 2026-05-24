import os
from PIL import Image, UnidentifiedImageError
import torch
from torch.utils.data import Dataset


class DeepfakeDataset(Dataset):

    def __init__(self, data, transform=None):
        """
        data: list of (image_path, label)
        """
        self.data = data
        self.transform = transform

        print("Total dataset samples:", len(self.data))

    def __len__(self):
        return len(self.data)

    def __getitem__(self, idx):

        img_path, label = self.data[idx]

        
        if not os.path.exists(img_path):
            raise FileNotFoundError(f"Missing file: {img_path}")

        try:
            image = Image.open(img_path).convert("RGB")
        except (UnidentifiedImageError, OSError) as e:
            raise ValueError(f"Corrupted image: {img_path}") from e

        if self.transform:
            image = self.transform(image)

        label = torch.tensor(label, dtype=torch.long)

        return image, label