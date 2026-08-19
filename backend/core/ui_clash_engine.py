class UIClashEngine:
    """
    Checks if critical thumbnail elements (like faces or text) fall into 
    the "Danger Zones" where the YouTube UI (timestamps, buttons) overlays the image.
    """
    
    def __init__(self):
        # Define danger zones as relative bounding boxes [x_min, y_min, x_max, y_max]
        self.danger_zones = {
            "Bottom Right Timestamp": [0.75, 0.75, 1.0, 1.0],
            "Top Right Overlay": [0.80, 0.0, 1.0, 0.25],
        }

    def check_overlap(self, box, zone):
        # box and zone are [xmin, ymin, xmax, ymax]
        # Check if there is intersection
        x_left = max(box[0], zone[0])
        y_top = max(box[1], zone[1])
        x_right = min(box[2], zone[2])
        y_bottom = min(box[3], zone[3])

        if x_right > x_left and y_bottom > y_top:
            return True
        return False

    def analyze_ui_clash(self, face_boxes: list, text_boxes: list) -> dict:
        clash_risk = False
        penalty = 0.0
        warnings = []
        
        # Check text boxes
        for t_box in text_boxes:
            for zone_name, zone_coords in self.danger_zones.items():
                if self.check_overlap(t_box, zone_coords):
                    clash_risk = True
                    penalty += 5.0
                    warnings.append(f"UI Clash Risk: Some of your text is placed in the {zone_name} danger zone. It will be completely blocked by YouTube's interface on mobile devices.")
                    
        # Check face boxes
        for f_box in face_boxes:
            for zone_name, zone_coords in self.danger_zones.items():
                if self.check_overlap(f_box, zone_coords):
                    clash_risk = True
                    penalty += 3.0
                    if f"UI Clash Risk: Your face is positioned in the {zone_name}." not in warnings:
                        warnings.append(f"UI Clash Risk: Your face is positioned in the {zone_name}. The YouTube timestamp or overlay icons may cover your expression.")
                        
        # Deduplicate warnings
        warnings = list(set(warnings))
        
        return {
            "ui_clash_risk": clash_risk,
            "ui_clash_penalty": penalty,
            "ui_warnings": warnings
        }
