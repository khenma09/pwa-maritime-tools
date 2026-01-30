import sys
import threading
import time
import json
from http.server import HTTPServer, SimpleHTTPRequestHandler
from playwright.sync_api import sync_playwright

def start_server():
    try:
        server = HTTPServer(('localhost', 8083), SimpleHTTPRequestHandler)
        server.serve_forever()
    except OSError:
        pass

server_thread = threading.Thread(target=start_server)
server_thread.daemon = True
server_thread.start()
time.sleep(1)

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()

        # Inject quiz data so review page doesn't error out immediately
        quiz_data = {
            "userAnswers": [
                {"question": "Q1", "options": ["A", "B"], "userAnswer": 0, "correctAnswer": 0, "isCorrect": True}
            ],
            "attempt": 1,
            "correctAnswers": 1,
            "percentage": 100,
            "questionLimit": 1
        }

        # Set sessionStorage before navigation
        # We need to go to a page on the domain first, or use a script that runs on load
        page.goto("http://localhost:8083/index.html")
        page.evaluate("(data) => sessionStorage.setItem('quizData', JSON.stringify(data))", quiz_data)

        print("Loading review page...")
        page.goto("http://localhost:8083/review.html")

        # Check if Security object exists
        security_exists = page.evaluate("typeof window.Security !== 'undefined'")
        print(f"Security object exists: {security_exists}")

        if not security_exists:
            print("FAILURE: Security object missing on review.html")
            sys.exit(1)

        print("SUCCESS: Review page loaded with Security object.")
        browser.close()
        sys.exit(0)

if __name__ == "__main__":
    run()
