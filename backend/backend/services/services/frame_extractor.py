import cv2

def extract_frames(video_path):

    video = cv2.VideoCapture(video_path)

    frames = []

    while True:

        success, frame = video.read()

        if not success:
            break

        frames.append(frame)

    video.release()

    return frames