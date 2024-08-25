from flask import Flask, request, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

API_KEY = 'AIzaSyDziEiGEEHrNnwdbh9db9veEH-aBQfjj-g'  # Replace with your Google Gemini API key

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        text = data.get('text', '')

        if not text:
            return jsonify({'error': 'No text provided'}), 400

        headers = {
            'Content-Type': 'application/json'
        }
        payload = {
            "contents": [
                {
                    "parts": [
                        {
                            "text": f"Extract the following details from this grievance: {text}\n\n"
                                    "1. Category\n"
                                    "2. Sub-Category\n"
                                    "3. Grievance Description\n"
                                    "4. Submission Date\n"
                                    "5. Location\n"
                                    "6. User Demographics\n"
                                    "7. Initial Response Date\n"
                                    "8. Assigned Department\n"
                                    "9. Current Status\n"
                                    "10. Resolution Date\n"
                                    "11. Response Actions"
                                    "reduce the output in only just json format nothing else only plane text"
                        }
                    ]
                }
            ]
        }

        response = requests.post(
            f'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key={API_KEY}',
            headers=headers,
            json=payload
        )

        if response.status_code == 200:
            result = response.json()
            print("Gemini Model Output:", result)  # Print the raw Gemini output to console

            # Parsing the model output
            if 'candidates' in result:
                model_output = result['candidates'][0]['content']['parts'][0]['text']
                return jsonify({'response': model_output})
            else:
                return jsonify({'error': 'Unexpected response structure'}), 500
        else:
            return jsonify({'error': response.text}), response.status_code

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
