# Use official Python image as base
FROM python:3.12

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

# Set work directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
build-essential \
cmake \
libopenblas-dev \
liblapack-dev \
libjpeg-dev \
curl \
git \
ninja-build \
clang \
python3-dev \
&& rm -rf /var/lib/apt/lists/*

RUN pip install --upgrade pip setuptools wheel

RUN pip install --no-cache-dir \
    fastapi \
    uvicorn[standard] \
    pillow \
    llama-cpp-python==0.3

# Create models directory and download model
RUN mkdir -p /app/models && \
    curl -L -o /app/models/SmolVLM2-2.2B-Instruct-Q4_K_M.gguf https://huggingface.co/ggml-org/SmolVLM2-2.2B-Instruct-GGUF/resolve/main/SmolVLM2-2.2B-Instruct-Q4_K_M.gguf?download=true

# Copy your application code
COPY . .

# Expose the FastAPI port
EXPOSE 8000

# Run the application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
