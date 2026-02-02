# Embedding Service

Turkish text embedding microservice using sentence-transformers.

## Setup

```bash
pip install -r requirements.txt
```

## Run

```bash
python app.py
```

Service will run on http://localhost:5000

## Endpoints

### Health Check
```
GET /health
```

### Single Embedding
```
POST /embed
Content-Type: application/json

{
  "text": "Allah hiç kimseye gücünün üstünde yük yüklemez"
}
```

### Batch Embedding
```
POST /embed/batch
Content-Type: application/json

{
  "texts": ["text1", "text2", "text3"]
}
```
