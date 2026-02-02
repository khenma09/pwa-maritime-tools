import json
import subprocess
import time
import sys
import os
from playwright.sync_api import sync_playwright

def run_test():
    # Start server
    server_process = subprocess.Popen(
        [sys.executable, "-m", "http.server", "8081"],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL
    )
    time.sleep(2) # Wait for server to start

    try:
        with sync_playwright() as p:
            browser = p.chromium.launch()
            page = browser.new_page()

            url = "http://localhost:8081/leaderboard.html"

            # Navigate to page to initialize localStorage context
            page.goto(url)

            # Malicious payload
            payload = [
                {
                    "name": "Hacker",
                    "age": "<img src=x onerror=console.log('XSS') id='xss-trigger'>",
                    "percentage": 100,
                    "correctAnswers": 10,
                    "totalQuestions": 10,
                    "category": "Hacking",
                    "date": "2023-10-27T10:00:00.000Z"
                }
            ]

            # Inject payload
            page.evaluate("(data) => localStorage.setItem('quizLeaderboard', JSON.stringify(data))", payload)

            # Reload to render
            page.reload()

            # Check if the ID 'xss-trigger' exists in the DOM.
            xss_element = page.query_selector("#xss-trigger")

            if xss_element:
                print("FAILURE: XSS element found in DOM.")
                return False
            else:
                print("SUCCESS: XSS element not found (escaped correctly).")

                # Verify content is present but escaped
                cell = page.query_selector("tr.rank-1 td.name-cell")
                if cell:
                    content = cell.inner_html()
                    if "&lt;img" in content:
                         print(f"Verified escaped content: {content}")
                         return True
                    else:
                        print(f"FAILURE: Payload not found or not escaped as expected: {content}")
                        return False
                else:
                    print("FAILURE: Could not find table cell.")
                    return False

            browser.close()

    finally:
        server_process.kill()

if __name__ == "__main__":
    success = run_test()
    if not success:
        sys.exit(1)
