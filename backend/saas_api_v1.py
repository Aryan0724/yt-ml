from flask import Flask, request, jsonify
from creator_intelligence_engine import CreatorIntelligenceEngine
import os

app = Flask(__name__)
engine = CreatorIntelligenceEngine()

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "ready", "version": engine.version})

@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.json
    if not data:
        return jsonify({"error": "No data provided"}), 400
    
    result = engine.analyze_single(data)
    return jsonify(result)

@app.route('/compare', methods=['POST'])
def compare():
    data = request.json
    if not data or 'options' not in data:
        return jsonify({"error": "No options provided for comparison"}), 400
    
    result = engine.compare_thumbnails(data['options'])
    return jsonify(result)

if __name__ == "__main__":
    # In a real environment, we'd use gunicorn or similar
    # For now, we'll just define the interface
    print("Creator Intelligence API Server Initialized.")
    print("Endpoints: /analyze, /compare")
    # app.run(port=5000)
