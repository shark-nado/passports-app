# Stage 1: Build React frontend
FROM node:22-alpine AS frontend-builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Python backend
FROM python:3.14-slim
WORKDIR /app

# Copy backend
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY backend/ backend/

# Copy built frontend
COPY --from=frontend-builder /app/dist/ /app/static/

# Expose port
EXPOSE 8000

# Run with uvicorn, serving API + static files
CMD ["uvicorn", "backend.app:app", "--host", "0.0.0.0", "--port", "8000"]
