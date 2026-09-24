

import os
from ultralytics import YOLO

# ---------------------------------------------------------------------
# STEP 2 — set this to YOUR extracted dataset folder (the one that
# directly contains data.yaml)
# ---------------------------------------------------------------------
DATASET_PATH = r"D:\SIH\Pathhole.v1i.yolov8"

# ---------------------------------------------------------------------
# Training settings (defaults are sensible for a prototype)
# ---------------------------------------------------------------------
EPOCHS = 60
IMG_SIZE = 640
BATCH = 16
MODEL_SIZE = "yolov8n.pt"   # "nano" — lightest & fastest, ideal for edge/laptop inference


def main():
    data_yaml = os.path.join(DATASET_PATH, "data.yaml")

    if not os.path.exists(data_yaml):
        print(f"[ERROR] Could not find data.yaml at: {data_yaml}")
        print("        Double-check DATASET_PATH points to the folder that")
        print("        directly contains data.yaml (after extracting the zip).")
        return

    print(f"[INFO] Using dataset: {data_yaml}")
    print("[INFO] Loading base YOLOv8n model...")
    model = YOLO(MODEL_SIZE)

    print("[INFO] Starting training...")
    model.train(
        data=data_yaml,
        epochs=EPOCHS,
        imgsz=IMG_SIZE,
        batch=BATCH,
        name="pothole_train",
    )

    print("[INFO] Training complete!")
    print("[INFO] Best weights saved at: runs/detect/pothole_train/weights/best.pt")
    print("[INFO] Copy/rename that file to: phase2_edge_ai/models/pothole.pt")
    print("[INFO] edge_ai.py will auto-detect it on next run — no code changes needed.")


if __name__ == "__main__":
    main()
