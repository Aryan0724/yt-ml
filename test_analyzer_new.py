import cv2
import numpy as np
import os
import urllib.request

def test():
    print("Testing MTCNN...")
    try:
        from mtcnn import MTCNN
        detector = MTCNN()
        print("MTCNN loaded.")
    except Exception as e:
        print(f"MTCNN failed: {e}")
        
    print("Testing YOLO...")
    try:
        from ultralytics import YOLO
        # Just instantiate a small model to see if it downloads/loads
        model = YOLO("yolov8n.pt")
        print("YOLO loaded.")
    except Exception as e:
        print(f"YOLO failed: {e}")

if __name__ == "__main__":
    test()
