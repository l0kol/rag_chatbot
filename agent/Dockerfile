# agent/Dockerfile
FROM python:3.13-slim

# Set working directory
WORKDIR /app

# Install dependencies
COPY agent/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy source code
COPY agent/ .

# Expose port
EXPOSE 8000

# Run app
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
