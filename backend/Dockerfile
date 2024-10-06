# Use an image with gdal installed
FROM ghcr.io/osgeo/gdal:ubuntu-small-latest

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set work directory
WORKDIR /app

# Copy project
COPY . .

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends gcc libpq-dev python3-pip && rm -rf /var/lib/apt/lists/*
RUN pip install --break-system-packages --no-cache-dir -r requirements.txt

EXPOSE 8000

# Run cron and FastAPI using Uvicorn
#CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
CMD ["/bin/bash", "-c", "python3 poll_landsat.py & uvicorn main:app --host 0.0.0.0 --port 8000 --reload"]
