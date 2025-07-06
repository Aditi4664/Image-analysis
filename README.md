# 🚀 Image Splitter App — FastAPI + React

This project contains a full-stack application with:

•⁠  ⁠🔧 *FastAPI backend* running at [http://localhost:8000](http://localhost:8000)
•⁠  ⁠🎨 *React frontend* running at [http://localhost:3000](http://localhost:3000)

Both services are containerized and orchestrated using *Docker Compose*.

---

## 📦 Prerequisites

Make sure you have the following installed on your system:

•⁠  ⁠🐳 [Docker Desktop](https://www.docker.com/products/docker-desktop/)
•⁠  ⁠🧱 [Docker Compose](https://docs.docker.com/compose/install/) (comes with Docker Desktop)

---
## ▶️ Start the Application using Docker Compose

To start the application, run:

```bash
docker compose -f docker-compose.yml up --build

## 🌐 Access the Application

•⁠  ⁠*Frontend UI:* [http://localhost:3000](http://localhost:3000)
•⁠  ⁠*Backend API (FastAPI docs):* [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 🐳 Running in Docker Desktop

Once the app is running, open *Docker Desktop*:

•⁠  ⁠Go to the *Containers* tab
•⁠  ⁠You will see two containers:
  - ⁠ fastapi-backend ⁠
  - ⁠ react-frontend ⁠

Each container shows:

•⁠  ⁠✅ Live logs
•⁠  ⁠💻 Terminal access
•⁠  ⁠🔁 Port mappings

You can *start, **stop, and **restart* the containers from the Docker UI.

---

## 🧼 To Stop the App

•⁠  ⁠Press ⁠ Ctrl + C ⁠ in the terminal running Docker Compose
•⁠  ⁠Or use Docker Desktop to stop the containers manually

To remove all running containers and networks:

```bash
docker compose down
```

## Web App: Demo

# Tutorial Steps
## Start Page 
<img src="https://github.com/Aditi4664/Image-analysis/blob/main/start.jpeg?raw=true">


## Step 1 (We upload the picture and select the points to split)
<img src="https://github.com/Aditi4664/Image-analysis/blob/main/3.jpeg?raw=true"/>


## Step 2 (Put our prompt in the LLM like `give the details about both the images ´)
<img src="https://github.com/Aditi4664/Image-analysis/blob/main/4.jpeg?raw=true">

## Step 3 (We get the details of the image from the prompt )
<img src="https://github.com/Aditi4664/Image-analysis/blob/main/2.jpeg?raw=true">
