import cv2
import numpy as np

def calculate_colorfulness(image):
    # Split the image into its respective RGB components
    (B, G, R) = cv2.split(image.astype("float"))
    
    # Compute rg = R - G
    rg = np.absolute(R - G)
    
    # Compute yb = 0.5 * (R + G) - B
    yb = np.absolute(0.5 * (R + G) - B)
    
    # Compute the mean and standard deviation of both `rg` and `yb`
    (rbMean, rbStd) = (np.mean(rg), np.std(rg))
    (ybMean, ybStd) = (np.mean(yb), np.std(yb))
    
    # Combine the mean and standard deviations
    stdRoot = np.sqrt((rbStd ** 2) + (ybStd ** 2))
    meanRoot = np.sqrt((rbMean ** 2) + (ybMean ** 2))
    
    # Derive the "colorfulness" metric and return it
    return stdRoot + (0.3 * meanRoot)

def calculate_rule_of_thirds_score(image, bbox):
    # bbox: [x1, y1, x2, y2]
    h, w = image.shape[:2]
    # intersections
    intersections = [
        (w/3, h/3), (2*w/3, h/3),
        (w/3, 2*h/3), (2*w/3, 2*h/3)
    ]
    
    bx = (bbox[0] + bbox[2]) / 2.0
    by = (bbox[1] + bbox[3]) / 2.0
    
    # Min distance to any intersection
    min_dist = min([np.sqrt((bx - ix)**2 + (by - iy)**2) for ix, iy in intersections])
    # Max possible distance is roughly half diagonal
    max_dist = np.sqrt(w**2 + h**2) / 2.0
    score = max(0, 100 - (min_dist / max_dist) * 200) # Simple linear scaling
    return score

print("Feature functions loaded.")
