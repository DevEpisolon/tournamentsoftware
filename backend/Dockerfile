# Use the official Python image from the Docker Hub
FROM python:3.12

# Set the working directory in the container
WORKDIR /app

# Copy the requirements.txt file into the container at /app
COPY requirements.txt .

# Install the dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Install mongo drivers
RUN pip install "pymongo[srv]"

# Copy the rest of the working directory contents into the container at /app
COPY . .

# Expose the port the app runs on

# Command to run the FastAPI app with uvicorn
CMD ["uvicorn", "fastapi_app:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
