import torch
import torch.nn as nn
from torch.utils.data import DataLoader
from torchvision import transforms

from ml.dataset import DeepfakeDataset
from ml.cnn_model import SimpleCNN
from ml.data_loader import load_data

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print(f"Training on: {device}")


transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.RandomHorizontalFlip(),
    transforms.ToTensor()
])


train_data, val_data, test_data = load_data()

# Build datasets with transforms applied
train_dataset = DeepfakeDataset(train_data, transform)
val_dataset = DeepfakeDataset(val_data, transform)
test_dataset = DeepfakeDataset(test_data, transform)

train_loader = DataLoader(train_dataset, batch_size=32, shuffle=True)
val_loader = DataLoader(val_dataset, batch_size=32)
model = SimpleCNN().to(device)

criterion = nn.CrossEntropyLoss(weight=torch.tensor([1.0, 1.2]).to(device))
optimizer = torch.optim.Adam(model.parameters(), lr=0.0001)

epochs = 10

print("TRAINING STARTED")

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
    print("DATA SIZE:", len(train_dataset))

torch.save(model.state_dict(), "models/cnn.pth")
print("CNN MODEL SAVED")
# 

test_loader = DataLoader(test_dataset, batch_size=32, shuffle=False)

def evaluate(model, loader):
    model.eval()
    correct = 0
    total = 0

    with torch.no_grad():
        for images, labels in loader:
            outputs = model(images)
            _, preds = torch.max(outputs, 1)

            correct += (preds == labels).sum().item()
            total += labels.size(0)

    print("Test Accuracy:", correct / total)


evaluate(model, test_loader)