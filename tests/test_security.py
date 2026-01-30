import sys
import threading
import time
import json
from http.server import HTTPServer, SimpleHTTPRequestHandler
from playwright.sync_api import sync_playwright

# Start a simple HTTP server
def start_server():
    try:
        server = HTTPServer(('localhost', 8082), SimpleHTTPRequestHandler)
        server.serve_forever()
    except OSError:
        print("Port 8082 in use, assuming server running")

server_thread = threading.Thread(target=start_server)
server_thread.daemon = True
server_thread.start()
time.sleep(1) # Wait for server to start

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()

        # 1. Load the page initially
        print("Loading leaderboard page...")
        page.goto("http://localhost:8082/leaderboard.html")

        # 2. Inject malicious payload into localStorage
        malicious_data = [
            {
                "name": "Hacker",
                "age": "<img src=x onerror=window.xss_triggered=true>",
                "percentage": 100,
                "correctAnswers": 5,
                "totalQuestions": 5,
                "category": "Hacking",
                "date": "2023-10-27T10:00:00.000Z"
            }
        ]

        json_data = json.dumps(malicious_data)
        page.evaluate("(data) => localStorage.setItem('quizLeaderboard', data)", json_data)
        print("Injected malicious payload.")

        # 3. Reload to render the leaderboard with the payload
        print("Reloading page...")
        page.reload()

        # 4. Check if XSS triggered
        try:
            # Wait a bit to ensure it doesn't trigger
            page.wait_for_function("window.xss_triggered === true", timeout=2000)
            print("FAILURE: XSS payload executed!")
            vulnerable = True
        except Exception:
            print("SUCCESS: XSS payload did NOT execute.")
            vulnerable = False

        browser.close()

        if not vulnerable:
            sys.exit(0) # Pass
        else:
            sys.exit(1) # Fail

if __name__ == "__main__":
    run()
