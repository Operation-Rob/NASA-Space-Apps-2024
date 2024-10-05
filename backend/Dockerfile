# Use an official Python runtime as a parent image
FROM python:3.9-slim

# Set the working directory
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Expose FastAPI default port
EXPOSE 8000

# Run FastAPI using Uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
