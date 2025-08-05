from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import os
import csv
from datetime import datetime, timedelta
from googletrans import Translator
import subprocess
import signal
import pandas as pd

# Store the subprocess globally
process = None

app = Flask(__name__)
CORS(app)

# Load English model
with open("english_emotion_text_classifier.pkl", "rb") as f:
    english_model = pickle.load(f)

ENGLISH_TO_TAMIL_EMOTIONS = {
    'neutral': 'நடுநிலை',
    'joy': 'மகிழ்ச்சி',
    'sadness': 'வருத்தம்',
    'fear': 'அச்சம்',
    'surprise': 'அதிர்ச்சி',
    'anger': 'கோபம்',
    'disgust': 'வெறுப்பு'
}

# Handles Trends page
@app.route('/get_emotion_data', methods=['GET'])
def get_emotion_data():
    date_str = request.args.get('date', datetime.now().strftime('%Y-%m-%d'))
    csv_file = 'emotion_predictions_log.csv'  # Update with your actual CSV path


    
    try:
        # Define column names
        columns = ['Timestamp', 'Language', 'Text', 'Emotion']

        # Load the CSV with column names
        df = pd.read_csv(csv_file, names=columns)

        # Convert timestamp to date
        df['Date'] = pd.to_datetime(df['Timestamp']).dt.date

        selected_date = datetime.strptime(date_str, '%Y-%m-%d').date()
        daily_data = df[df['Date'] == selected_date].copy()

        
        # Group by hour and get emotion counts
        daily_data['Hour'] = pd.to_datetime(daily_data['Timestamp']).dt.hour
        emotion_counts = daily_data.groupby(['Hour', 'Emotion']).size().unstack(fill_value=0)
        
        # Convert to format suitable for frontend
        emotions = ['neutral', 'joy', 'sadness', 'fear', 'surprise', 'anger', 'disgust']
        result = []
        
        for hour in range(24):
            hour_data = {'hour': hour}
            for emotion in emotions:
                hour_data[emotion] = int(emotion_counts.get(emotion, {}).get(hour, 0))
            result.append(hour_data)
            
        return jsonify({
            'date': date_str,
            'data': result,
            'status': 'success'
        })     

    except Exception as e:
        return jsonify({
            'error': str(e),
            'status': 'error'
        }), 500

# Predicts emotion from text
def predict_emotion(text, language):
    """Predict emotion using the appropriate model with complete label mappings"""
    try:
        print(language)
        text = text if language == 'english' else tamil_to_english(text)
        print(text)
        prediction = english_model.predict([text])[0]

        # CSV Logging
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        csv_file = "emotion_predictions_log.csv"
        file_exists = os.path.isfile(csv_file)

        with open(csv_file, "a", newline='', encoding='utf-8') as file:
            writer = csv.writer(file)
            if not file_exists:
                writer.writerow(["Timestamp", "Language", "Input Text", "Predicted Emotion"])
            writer.writerow([timestamp, language, text, prediction['label']])

        return prediction['label'] if language == 'english' else ENGLISH_TO_TAMIL_EMOTIONS.get(prediction['label'])
            
    except Exception as e:
        print(f"Error during prediction: {str(e)}")
        return 'neutral' if language == 'english' else 'நடுநிலை'
    

def tamil_to_english(text):
    translator = Translator()
    translated = translator.translate(text, src='ta', dest='en')
    return translated.text

# Handles Textual emotion detection Page
@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.get_json()
    text = data.get('text', '').strip()
    language = data.get('language', 'english')

    if not text:
        return jsonify({'error': 'Text is required'}), 400

    try:
        emotion = predict_emotion(text, language)
        return jsonify({
            'text': text,
            'language': language,
            'emotion': emotion,
            'status': 'success'
        })
    except Exception as e:
        return jsonify({
            'error': str(e),
            'status': 'error'
        }), 500
    
# Handles Facial emotion detection Page - 1    
@app.route('/run_emotion_detection', methods=['GET'])
def run_emotion_detection():
    global process
    # Get the absolute path of the script
    print("Absolute script path:", os.path.abspath('face_emotion_detector.py'))
    script_path = os.path.abspath('face_emotion_detector.py')
    if process is None or process.poll() is not None:  # Not running
        process = subprocess.Popen([
                    r'C:\Users\build\Downloads\Final Year Project\emotion-detection-app\backend\venv310\Scripts\python.exe',
                    script_path
                ])
        return jsonify({"status": "started"}), 200
    else:
        return jsonify({"status": "already_running"}), 200

# Handles Facial emotion detection Page - 2
@app.route('/stop_emotion_detection', methods=['GET'])
def stop_emotion_detection():
    global process
    if process and process.poll() is None:  # Process is running
        os.kill(process.pid, signal.SIGTERM)  # Terminate the process
        process = None
        return jsonify({"status": "stopped"}), 200
    else:
        return jsonify({"status": "not_running"}), 200


if __name__ == '__main__':
    app.run(debug=True, port=5000)