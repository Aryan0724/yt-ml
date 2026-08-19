class MobileSimulator:
    """
    Simulates environmental stress on a thumbnail (e.g. viewed on a dim phone screen
    while commuting, or with Night Shift enabled).
    """
    
    def __init__(self):
        # Environmental modifiers
        self.contrast_penalty_modifier = 0.60 # Simulating 40% loss of contrast on cheap mobile screens
        self.saturation_nightmode_penalty = 0.50 # Simulating loss of saturation due to warm night-mode filters
        
    def simulate_dim_screen(self, raw_brightness: float, raw_contrast: float, text_density: int) -> dict:
        # Simulate how the image metrics hold up under stress
        stressed_brightness = raw_brightness * 0.70 # Dim screen
        stressed_contrast = raw_contrast * self.contrast_penalty_modifier
        
        failure_risk = False
        penalty = 0.0
        warnings = []
        
        # If the original contrast was already mediocre, the stress test destroys legibility.
        if stressed_contrast < 30.0:
            failure_risk = True
            penalty += 12.0
            warnings.append("Mobile Dim-Screen Failure! When we simulated viewing your thumbnail on a dimmed mobile screen, the contrast dropped below the legibility threshold. Your image turns into visual mush. Increase global contrast significantly.")
            
        # If there is too much text and the screen is dim/small, it becomes unreadable
        if text_density > 2 and stressed_brightness < 90:
            failure_risk = True
            penalty += 8.0
            warnings.append("Mobile Scale Failure! You have dense text in an image that is overall very dark. When downscaled to a mobile phone screen, this text becomes completely unreadable.")
            
        return {
            "mobile_stress_failure": failure_risk,
            "mobile_stress_penalty": penalty,
            "mobile_warnings": warnings
        }
