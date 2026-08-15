"""
frame_extractor.py
──────────────────
Extracts N evenly-spaced frames from a video file using OpenCV.
Returns a list of PIL Images ready for model inference.
"""

import cv2
from PIL import Image
import numpy as np
import logging

logger = logging.getLogger("deepfake-backend.frame_extractor")

# Supported video extensions
VIDEO_EXTENSIONS = {".mp4", ".mov", ".avi", ".mkv", ".webm", ".flv", ".wmv"}


def is_video_file(file_path: str) -> bool:
    """Return True if the file extension looks like a video."""
    import os
    ext = os.path.splitext(file_path)[1].lower()
    return ext in VIDEO_EXTENSIONS


def extract_representative_frames(video_path: str, n: int = 5) -> list:
    """
    Extract N evenly-spaced frames from a video.

    Args:
        video_path: Absolute path to the video file.
        n:          Number of frames to extract (default 5).

    Returns:
        A list of PIL.Image objects (RGB, 224×224 ready for transforms).

    Raises:
        ValueError: If the video cannot be opened or has no readable frames.
    """
    cap = cv2.VideoCapture(video_path)

    if not cap.isOpened():
        raise ValueError(f"Cannot open video file: {video_path}")

    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))

    if total_frames == 0:
        cap.release()
        raise ValueError(f"Video has 0 frames: {video_path}")

    # Clamp n to available frames
    n = min(n, total_frames)

    # Evenly-spaced frame indices (0-indexed)
    if n == 1:
        indices = [total_frames // 2]
    else:
        step = (total_frames - 1) / (n - 1)
        indices = [round(i * step) for i in range(n)]

    frames: list = []

    for idx in indices:
        cap.set(cv2.CAP_PROP_POS_FRAMES, idx)
        ret, frame = cap.read()

        if not ret:
            logger.warning(f"Could not read frame {idx} from {video_path} — skipping")
            continue

        # Convert BGR → RGB and wrap in PIL
        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        pil_image = Image.fromarray(frame_rgb)
        frames.append(pil_image)

    cap.release()

    if not frames:
        raise ValueError(f"No readable frames could be extracted from: {video_path}")

    logger.info(f"Extracted {len(frames)} frames from {video_path} (total={total_frames})")
    return frames
