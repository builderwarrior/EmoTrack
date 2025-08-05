# Emotion Detection App

A full-stack application for detecting human emotions from facial expressions and text using deep learning and natural language processing.

---

## Features

- **Facial Emotion Detection:** Real-time emotion recognition from webcam or images.
- **Text Emotion Detection:** Analyze and classify emotions from user-provided text (English and Tamil).
- **Modern Frontend:** Built with React for a responsive user experience.
- **RESTful Backend:** Flask API for model inference and orchestration.

---

## Project Structure

```
emotion-detection-app/
│
├── backend/
│   ├── app.py                  # Flask backend API
│   ├── requirements.txt        # Python dependencies
│   ├── face_emotion_detector.py# Facial emotion detection script
│   ├── model_78.h5             # (Not included) Keras model for face emotion
│   ├── english_emotion_text_classifier.pkl # (Not included) Text emotion model
│   └── ...                     # Other backend files
│
├── frontend/
│   ├── public/                 # Static assets
│   ├── src/                    # React source code
│   ├── package.json            # Frontend dependencies
│   └── ...                     # Other frontend files
│
└── README.md                   # Project documentation
```

---

## Getting Started

### Prerequisites

- **Python 3.10** (for backend)
- **Node.js 14+ & npm** (for frontend)

### 1. Clone the repository

```sh
git clone https://github.com/builderwarrior/EmoTrack.git
cd emotion-detection-app
```

### 2. Backend Setup

```sh
cd backend
python -m venv venv310
venv310\Scripts\activate   # On Windows
pip install -r requirements.txt
```

> **Note:**  
> Large model files (`model_78.h5`, `english_emotion_text_classifier.pkl`) are not included in the repo.  
> Place them in the `backend/` folder as needed.

### 3. Frontend Setup

```sh
cd ../frontend
npm install
```

---

## Running the Application

### Start Backend

```sh
cd backend
venv310\Scripts\activate
python app.py
```

### Start Frontend

```sh
cd frontend
npm start
```

- The frontend will be available at [http://localhost:3000](http://localhost:3000)
- The backend API will run at [http://localhost:5000](http://localhost:5000)

---

## Usage

- **Facial Emotion Detection:**  
  Navigate to the relevant page and allow webcam access to detect emotions in real time.
- **Text Emotion Detection:**  
  Enter text in the provided input to analyze its emotional tone.

---

## Notes

- **Model Files:**  
  Due to GitHub file size limits, large model files are not included.  
  Download or train the required models and place them in the `backend/` directory.

- **Environment Variables:**  
  If needed, create a `.env` file in `frontend/` or `backend/` for configuration.

---

## License

This project is for educational purposes.

---

## Acknowledgements

- [DeepFace](https://github.com/serengil/deepface) for facial emotion recognition
- [Flask](https://flask.palletsprojects.com/)
-
