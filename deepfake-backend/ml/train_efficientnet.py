import torch
import torch.nn as nn
from torch.utils.data import DataLoader
from torchvision import transforms

from ml.dataset import DeepfakeDataset
from ml.efficientnet_model import EfficientNetModel

from ml.data_loader import load_data
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.RandomHorizontalFlip(),
    transforms.ToTensor()
])

train_data, val_data = load_data()

train_dataset = DeepfakeDataset(train_data, transform)
val_dataset = DeepfakeDataset(val_data, transform)

train_loader = DataLoader(train_dataset, batch_size=16, shuffle=True)

model = EfficientNetModel().to(device)

criterion = nn.CrossEntropyLoss()
optimizer = torch.optim.Adam(model.parameters(), lr=0.0001)

epochs = 5

print("EFFICIENTNET TRAINING STARTED")

for epoch in range(epochs):
    model.train()
    total_loss = 0

    for batch_idx, (images, labels) in enumerate(train_loader):
        images, labels = images.to(device), labels.to(device)

        optimizer.zero_grad()
        outputs = model(images)
        loss = criterion(outputs, labels)

        loss.backward()
        optimizer.step()

        total_loss += loss.item()

        if batch_idx % 20 == 0:
            print(f"Batch {batch_idx}/{len(train_loader)}")

    print(f"Epoch {epoch+1}, Loss: {total_loss:.4f}")

torch.save(model.state_dict(), "models/efficientnet.pth")
print("EFFICIENTNET MODEL SAVED")