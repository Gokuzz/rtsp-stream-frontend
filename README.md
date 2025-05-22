# RTSP
RTSP Stream Viewer
RTSP Stream Viewer is a web application that allows users to view RTSP video streams in a browser. The backend, built with Django and Channels, processes RTSP streams using FFmpeg and streams them over WebSocket. The frontend, built with React and mpegts.js, renders the streams in a user-friendly interface.
Features

Add and remove RTSP streams dynamically.
Stream RTSP video to the browser using WebSocket and MPEG-TS.
Optimized FFmpeg settings for low resource usage.
Error handling for WebSocket and stream failures.
Deployable to Render (backend) and GitHub Pages (frontend).

Prerequisites

Python 3.11+ (for backend)
Node.js 18+ and npm (for frontend)
FFmpeg (installed on the backend server)
Git (for version control)
Render account (for backend deployment)
GitHub account (for frontend deployment)
Optional: Redis (for production WebSocket scaling)

Project Structure
rtsp-stream-viewer/
├── rtsp-fe/                  # Frontend (React)
│   ├── src/
│   │   ├── components/
│   │   │   └── StreamPlayer.js  # Video player component
│   │   └── App.js            # Main React app
│   ├── package.json          # Frontend dependencies
│   └── README.md             # Frontend-specific instructions
├── rtsp-be/                  # Backend (Django)
│   ├── rtsp_viewer/
│   │   ├── asgi.py           # ASGI configuration
│   │   ├── settings.py       # Django settings
│   │   └── urls.py           # URL routing
│   ├── streams/
│   │   ├── consumers.py      # WebSocket consumer
│   │   └── routing.py        # WebSocket routing
│   ├── requirements.txt      # Backend dependencies
│   ├── manage.py             # Django management script
│   └── Dockerfile            # Docker configuration for Render
└── README.md                 # This file

Setup Instructions
Backend Setup (Django)

Clone the Repository:
git clone <repository-url>
cd rtsp-be


Create a Virtual Environment:
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate


Install Dependencies:
pip install -r requirements.txt

Ensure requirements.txt includes:
django>=4.2
channels>=4.0
channels-redis>=4.0
ffmpeg-python>=0.2.0
gunicorn>=20.1
uvicorn>=0.18


Configure Settings:Edit rtsp_viewer/settings.py:
ALLOWED_HOSTS = ['rtsp-stream-backend-1.onrender.com', 'localhost', '127.0.0.1', 'gokuzz.github.io']
CORS_ALLOWED_ORIGINS = ["https://gokuzz.github.io", "http://localhost:3000"]

CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels.layers.InMemoryChannelLayer',  # For development
        # For production, use Redis:
        # 'BACKEND': 'channels_redis.core.RedisChannelLayer',
        # 'CONFIG': {
        #     "hosts": [("redis://:your_redis_password@redis.serv.render.com:6379")],
        # },
    },
}


Run Migrations:
python manage.py migrate


Test Locally:
python manage.py runserver

The backend should be accessible at http://localhost:8000.


Frontend Setup (React)

Navigate to Frontend Directory:
cd rtsp-fe


Install Dependencies:
npm install

Key dependency: mpegts.js for video playback.

Configure WebSocket URL:Edit src/App.js:
const websocketUrl = 'wss://rtsp-stream-backend-1.onrender.com'; // For production
// const websocketUrl = 'ws://localhost:8000'; // For local development


Run Locally:
npm start

The frontend should open at http://localhost:3000.


Deployment
Backend Deployment (Render)

Create a Render Account:Sign up at render.com.

Push Code to GitHub:Ensure your backend code is in a GitHub repository.

Create a New Web Service:

In the Render dashboard, click "New" > "Web Service".
Connect your GitHub repository and select the backend folder (rtsp-be).
Configure:
Environment: Docker
Dockerfile Path: Dockerfile
Instance Type: Starter (1GB RAM recommended for FFmpeg)
Environment Variables:
PYTHON_VERSION: 3.11
PORT: 8000 (or as required by Render)






Dockerfile:Ensure rtsp-be/Dockerfile is:
FROM python:3.11

RUN apt-get update && apt-get install -y ffmpeg
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["gunicorn", "--bind", "0.0.0.0:$PORT", "--worker-class", "uvicorn.workers.UvicornWorker", "rtsp_viewer.asgi:application"]


Deploy:

Trigger a deployment in Render.
Note the deployed URL (e.g., https://rtsp-stream-backend-1.onrender.com).


Test WebSocket:
wscat -c "wss://rtsp-stream-backend-1.onrender.com/ws/stream/1747919172407/?rtsp=rtsp%3A%2F%2Fwowzaec2demo.streamlock.net%2Fvod%2Fmp4%3ABigBuckBunny_115k.mov" -H "Origin: https://gokuzz.github.io"



Frontend Deployment (GitHub Pages)

Install gh-pages:
cd rtsp-fe
npm install gh-pages --save-dev


Configure package.json:Add to rtsp-fe/package.json:
"homepage": "https://gokuzz.github.io",
"scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d build"
}


Deploy:
npm run deploy

The frontend will be available at https://gokuzz.github.io.

Verify:Open https://gokuzz.github.io and add an RTSP URL (e.g., rtsp://wowzaec2demo.streamlock.net/vod/mp4:BigBuckBunny_115k.mov).


Usage

Access the Frontend:

Open https://gokuzz.github.io (or http://localhost:3000 for local development).
Enter an RTSP URL (e.g., rtsp://camera:camAccess2024@49.248.155.178:554/cam/realmonitor?channel=5&subtype=0).
Click "Add Stream" to start streaming.


Remove Streams:

Click the "✖ Remove Stream" button to stop a stream.



Optimization Notes

FFmpeg Settings: The backend uses optimized FFmpeg parameters (video_bitrate='500k', s='640x480', preset='ultrafast', tune='zerolatency') to minimize memory usage, suitable for Render’s free/starter tiers.
Render Plan: For multiple streams or higher quality, upgrade to a paid Render plan (e.g., Standard with 2GB RAM).
Redis: Use channels_redis for production to handle WebSocket scaling.

Troubleshooting

WebSocket Connection Fails:

Verify ALLOWED_HOSTS and CORS_ALLOWED_ORIGINS in settings.py.
Test with wscat (see deployment steps).
Check Render logs for routing errors.


FFmpeg Fails (Exit Code -9):

Monitor Render’s memory usage in the "Metrics" tab.
Upgrade Render plan if memory is limited.
Test RTSP URL locally:ffmpeg -rtsp_flags prefer_tcp <rtsp-url> -f null -




Frontend Errors:

Check browser console for WebSocket or mpegts.js errors.
Ensure websocketUrl in App.js uses wss:// for production.


Mixed Content Errors:

Ensure all WebSocket connections use wss:// (not ws://) when deployed.



Contributing

Fork the repository.
Create a feature branch (git checkout -b feature/xyz).
Commit changes (git commit -m "Add xyz feature").
Push to the branch (git push origin feature/xyz).
Open a pull request.

License
This project is licensed under the MIT License.
Acknowledgments

Django Channels for WebSocket support.
mpegts.js for browser-based video playback.
FFmpeg for stream processing.
Render and GitHub Pages for hosting.

