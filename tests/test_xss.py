import os
import sys
import threading
import time
import json
from http.server import HTTPServer, SimpleHTTPRequestHandler
from playwright.sync_api import sync_playwright

# Server configuration
PORT = 8081
server = None

def start_server():
    global server
    try:
        # Serve from current directory
        server = HTTPServer(('localhost', PORT), SimpleHTTPRequestHandler)
        print(f"Server started on port {PORT}")
        server.serve_forever()
    except Exception as e:
        print(f"Failed to start server: {e}")

def stop_server():
    global server
    if server:
        server.shutdown()
        server.server_close()

def test_leaderboard_xss():
    # Start server in a separate thread
    server_thread = threading.Thread(target=start_server)
    server_thread.daemon = True
    server_thread.start()

    # Give server time to start
    time.sleep(2)

    try:
        with sync_playwright() as p:
            browser = p.chromium.launch()
            page = browser.new_page()

            url = f"http://localhost:{PORT}/leaderboard.html"

            # 1. Navigate to the page
            page.goto(url)

            # 2. Inject malicious data into localStorage
            malicious_payload = "<img src=x onerror=alert('XSS')>"
            # Note: leaderboard.js expects: name, age, percentage, correctAnswers, totalQuestions, category, date
            malicious_data = [
                {
                    "name": malicious_payload,
                    "age": "25",
                    "percentage": 100,
                    "correctAnswers": 5,
                    "totalQuestions": 5,
                    "category": malicious_payload,
                    "date": "2023-10-27T10:00:00.000Z"
                }
            ]

            # Use json.dumps to properly format the array for JS
            # We want: localStorage.setItem('quizLeaderboard', '[{"name": ...}]')
            json_data = json.dumps(malicious_data)

            # We must pass the stringified JSON as a string to setItem
            # json.dumps gives us the string representation of the list.
            # We need to escape single quotes if we wrap it in single quotes in JS.
            # Easier to use json.dumps again or rely on python string formatting with care.

            page.evaluate(f"localStorage.setItem('quizLeaderboard', JSON.stringify({json_data}));")

            # 3. Reload to render the data
            page.reload()

            # 4. Verify sanitization
            # Wait for the table to be populated
            try:
                page.wait_for_selector(".name-cell", timeout=5000)
            except:
                print("Timeout waiting for .name-cell. Maybe no data rendered?")
                # Check if no-data-message is visible
                if page.is_visible("#no-data-message"):
                    print("No data message is visible. Injection failed?")
                raise

            name_cell = page.locator(".name-cell").first
            category_badge = page.locator(".category-badge").first

            print(f"Name cell text: {name_cell.inner_text()}")
            print(f"Name cell HTML: {name_cell.inner_html()}")

            # Check text content - should contain the string literal
            assert malicious_payload in name_cell.inner_text(), "Name text should contain the payload as text"
            assert malicious_payload in category_badge.inner_text(), "Category text should contain the payload as text"

            # Check HTML content - should contain escaped entities
            name_html = name_cell.inner_html()

            # Depending on browser, it might be &lt; or encoded differently.
            # But importantly, it should NOT have a raw <img tag at the beginning of the injected content.
            assert "&lt;img" in name_html or "&amp;lt;img" in name_html, f"HTML should be escaped. Got: {name_html}"

            print("XSS Protection Verified: Payloads rendered as text, not HTML.")

            browser.close()

    except Exception as e:
        print(f"Test failed: {e}")
        sys.exit(1)
    finally:
        stop_server()

if __name__ == "__main__":
    test_leaderboard_xss()
