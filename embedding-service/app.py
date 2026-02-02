from flask import Flask, request, jsonify
from flask_cors import CORS
from sentence_transformers import SentenceTransformer
import numpy as np

app = Flask(__name__)
CORS(app)

print("Loading Turkish sentence transformer model...")
model = SentenceTransformer('emrecan/bert-base-turkish-cased-mean-nli-stsb-tr')
print("Model loaded successfully!")

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "healthy", "model": "emrecan/bert-base-turkish-cased-mean-nli-stsb-tr"})

@app.route('/embed', methods=['POST'])
def embed_single():
    try:
        data = request.get_json()
        
        if not data or 'text' not in data:
            return jsonify({"error": "Missing 'text' field"}), 400
        
        text = data['text']
        embedding = model.encode(text, convert_to_tensor=False)
        
        return jsonify({
            "embedding": embedding.tolist(),
            "dimension": len(embedding)
        })
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/embed/batch', methods=['POST'])
def embed_batch():
    try:
        data = request.get_json()
        
        if not data or 'texts' not in data:
            return jsonify({"error": "Missing 'texts' field"}), 400
        
        texts = data['texts']
        
        if not isinstance(texts, list):
            return jsonify({"error": "'texts' must be an array"}), 400
        
        embeddings = model.encode(texts, convert_to_tensor=False, show_progress_bar=True)
        
        return jsonify({
            "embeddings": embeddings.tolist(),
            "count": len(embeddings),
            "dimension": embeddings.shape[1] if len(embeddings) > 0 else 0
        })
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
