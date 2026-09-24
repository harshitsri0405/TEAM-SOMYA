"""
TEST the trained pothole model on NEW, UNSEEN images/video — WITHOUT
needing any labels. This just runs detection and saves/shows annotated
results so you can visually judge how well it generalizes.

Use this when you just have a folder of new photos (or a video) and
want to see the model's predictions, not official accuracy numbers.

STEP 1: Set MODEL_PATH and SOURCE below.
        SOURCE can be:
          - a folder of images, e.g. "new_photos/"
          - a single image, e.g. "new_photos/road1.jpg"
          - a video file, e.g. "test_clip.mp4"
          - 0  (use your laptop's webcam live)
STEP 2: Run: python test_on_new_images.py
"""

from ultralytics import YOLO
import cv2
import os
from tkinter import Tk, filedialog

# ============================================================
# SETTINGS
# ============================================================

MODEL_PATH = "best.pt"
CONF_THRESHOLD = 0.35

# Mobile camera URL
# Example:
# "http://192.168.1.100:8080/video"
MOBILE_CAMERA_URL = "http://192.168.1.100:8080/video"


# ============================================================
# LOAD MODEL
# ============================================================

def load_model():

    print(f"[INFO] Loading model: {MODEL_PATH}")

    if not os.path.exists(MODEL_PATH):
        print(f"[ERROR] Model not found: {MODEL_PATH}")
        print("[ERROR] Put best.pt in the same folder as this Python file.")
        return None

    model = YOLO(MODEL_PATH)

    print("[INFO] Model loaded successfully.")

    return model


# ============================================================
# LAPTOP CAMERA
# ============================================================

def laptop_camera(model):

    print("\n[INFO] Starting laptop camera...")
    print("[INFO] Press Q to stop.")

    cap = cv2.VideoCapture(0)

    if not cap.isOpened():
        print("[ERROR] Laptop camera could not be opened.")
        return

    while True:

        ret, frame = cap.read()

        if not ret:
            break

        results = model.predict(
            source=frame,
            conf=CONF_THRESHOLD,
            verbose=False
        )

        annotated_frame = results[0].plot()

        cv2.imshow(
            "Pothole Detection - Laptop Camera",
            annotated_frame
        )

        if cv2.waitKey(1) & 0xFF == ord("q"):
            break

    cap.release()
    cv2.destroyAllWindows()

    print("[INFO] Laptop camera stopped.")


# ============================================================
# MOBILE CAMERA
# ============================================================

def mobile_camera(model):

    print("\n==========================================")
    print("        MOBILE CAMERA DETECTION")
    print("==========================================")

    print("[INFO] Connecting to mobile camera...")
    print(f"[INFO] URL: {MOBILE_CAMERA_URL}")

    cap = cv2.VideoCapture(MOBILE_CAMERA_URL)

    if not cap.isOpened():

        print("\n[ERROR] Could not connect to mobile camera.")
        print("\nCheck these things:")
        print("1. Mobile and laptop are on the same Wi-Fi.")
        print("2. Mobile camera streaming app is running.")
        print("3. Camera URL is correct.")
        print("4. Windows Firewall is not blocking the connection.")

        return

    print("[INFO] Mobile camera connected!")
    print("[INFO] Press Q to stop.")

    while True:

        ret, frame = cap.read()

        if not ret:

            print("[ERROR] Could not read mobile camera frame.")
            break

        results = model.predict(
            source=frame,
            conf=CONF_THRESHOLD,
            verbose=False
        )

        annotated_frame = results[0].plot()

        cv2.imshow(
            "Pothole Detection - MOBILE CAMERA",
            annotated_frame
        )

        if cv2.waitKey(1) & 0xFF == ord("q"):
            break

    cap.release()
    cv2.destroyAllWindows()

    print("[INFO] Mobile camera stopped.")


# ============================================================
# ROAD VIDEO
# ============================================================

def video_detection(model):

    print("\n[INFO] Select road video...")

    root = Tk()
    root.withdraw()

    video_path = filedialog.askopenfilename(
        title="Select Road Video",
        filetypes=[
            ("Video Files", "*.mp4 *.avi *.mov *.mkv"),
            ("MP4 Files", "*.mp4"),
            ("All Files", "*.*")
        ]
    )

    root.destroy()

    if not video_path:
        print("[INFO] No video selected.")
        return

    print(f"[INFO] Selected: {video_path}")

    cap = cv2.VideoCapture(video_path)

    if not cap.isOpened():

        print("[ERROR] Could not open video.")
        return

    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    fps = cap.get(cv2.CAP_PROP_FPS)

    if fps <= 0:
        fps = 30

    os.makedirs("output", exist_ok=True)

    output_path = "output/pothole_detected_video.mp4"

    fourcc = cv2.VideoWriter_fourcc(*"mp4v")

    out = cv2.VideoWriter(
        output_path,
        fourcc,
        fps,
        (width, height)
    )

    frame_count = 0

    print("\n[INFO] Pothole detection started...")
    print("[INFO] Press Q to stop.")

    while True:

        ret, frame = cap.read()

        if not ret:
            break

        frame_count += 1

        results = model.predict(
            source=frame,
            conf=CONF_THRESHOLD,
            verbose=False
        )

        annotated_frame = results[0].plot()

        cv2.imshow(
            "Pothole Detection - Road Video",
            annotated_frame
        )

        out.write(annotated_frame)

        if cv2.waitKey(1) & 0xFF == ord("q"):
            break

    cap.release()
    out.release()
    cv2.destroyAllWindows()

    print("\n==========================================")
    print("       VIDEO DETECTION COMPLETE")
    print("==========================================")

    print(f"Frames processed: {frame_count}")
    print(f"Saved video: {output_path}")


# ============================================================
# IMAGE DETECTION
# ============================================================

def image_detection(model):

    print("\n[INFO] Select road image...")

    root = Tk()
    root.withdraw()

    image_path = filedialog.askopenfilename(
        title="Select Road Image",
        filetypes=[
            ("Image Files", "*.jpg *.jpeg *.png"),
            ("All Files", "*.*")
        ]
    )

    root.destroy()

    if not image_path:
        print("[INFO] No image selected.")
        return

    print(f"[INFO] Selected: {image_path}")

    results = model.predict(
        source=image_path,
        conf=CONF_THRESHOLD,
        verbose=False
    )

    annotated_image = results[0].plot()

    cv2.imshow(
        "Pothole Detection - Image",
        annotated_image
    )

    print("[INFO] Press any key to close.")

    cv2.waitKey(0)
    cv2.destroyAllWindows()


# ============================================================
# MAIN MENU
# ============================================================

def main():

    model = load_model()

    if model is None:
        return

    while True:

        print("\n")
        print("==========================================")
        print("       POTHOLE DETECTION SYSTEM")
        print("==========================================")

        print("1. Laptop Camera Detection")
        print("2. Mobile Camera Detection")
        print("3. Road Video Detection")
        print("4. Image Detection")
        print("5. Exit")

        print("==========================================")

        choice = input("Enter your choice (1-5): ")

        if choice == "1":

            laptop_camera(model)

        elif choice == "2":

            mobile_camera(model)

        elif choice == "3":

            video_detection(model)

        elif choice == "4":

            image_detection(model)

        elif choice == "5":

            print("[INFO] Exiting...")
            break

        else:

            print("[ERROR] Invalid choice!")


# ============================================================
# START PROGRAM
# ============================================================

if __name__ == "__main__":
    main()
