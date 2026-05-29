import requests
import json

try:
    url = "http://localhost:8000/students/?school_id=10&role=Administrator"
    response = requests.get(url)
    print(f"Status Code: {response.status_code}")
    if response.status_code == 200:
        data = response.json()
        print(f"Successfully fetched {len(data)} students.")
        if len(data) > 0:
            print("First student name:", data[0].get('name'))
    else:
        print("Error details:", response.text)
except Exception as e:
    print(f"Connection error: {e}")
