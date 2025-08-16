# Multi-stage build for production
FROM node:18-alpine AS frontend-builder

WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci --only=production

COPY frontend/ ./
RUN npm run build

# Python backend stage
FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PORT=8000

# Set work directory
WORKDIR /app

# Install system dependencies
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        build-essential \
        curl \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY backend/ ./backend/

# Copy frontend build
COPY --from=frontend-builder /app/frontend/build ./frontend/build

# Create a simple server to serve frontend
RUN pip install flask

# Create a simple Flask server to serve the React app
RUN echo 'from flask import Flask, send_from_directory\n\
import os\n\
\n\
app = Flask(__name__, static_folder="frontend/build")\n\
\n\
@app.route("/", defaults={"path": ""})\n\
@app.route("/<path:path>")\n\
def serve(path):\n\
    if path != "" and os.path.exists(app.static_folder + "/" + path):\n\
        return send_from_directory(app.static_folder, path)\n\
    else:\n\
        return send_from_directory(app.static_folder, "index.html")\n\
\n\
if __name__ == "__main__":\n\
    app.run(host="0.0.0.0", port=3000)\n\
' > serve_frontend.py

# Expose ports
EXPOSE 8000 3000

# Create startup script
RUN echo '#!/bin/bash\n\
echo "Starting Stock Market Dashboard..."\n\
echo "Starting backend server on port 8000..."\n\
cd backend && python -m uvicorn main:app --host 0.0.0.0 --port 8000 &\n\
echo "Starting frontend server on port 3000..."\n\
python serve_frontend.py &\n\
wait\n\
' > start.sh

RUN chmod +x start.sh

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# Start the application
CMD ["./start.sh"]
