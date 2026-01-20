import json
from playwright.sync_api import sync_playwright
import os
import unittest

class TestXSS(unittest.TestCase):
    def test_xss_protection(self):
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            context = browser.new_context()
            page = context.new_page()

            # Path to leaderboard.html
            cwd = os.getcwd()
            url = f"file://{cwd}/leaderboard.html"
            page.goto(url)

            # Inject malicious data into localStorage
            malicious_data = [
                {
                    "name": "Attacker",
                    "category": "General",
                    "percentage": 100,
                    "correctAnswers": 5,
                    "totalQuestions": 5,
                    "date": "2023-10-27T00:00:00.000Z",
                    "age": "\"><img src=x onerror=console.log('XSS_TRIGGERED')>"
                }
            ]

            # Serialize to JSON string and execute
            json_data = json.dumps(malicious_data)
            page.evaluate(
                "(data) => localStorage.setItem('quizLeaderboard', data)",
                json_data
            )

            # Setup console listener
            self.xss_triggered = False
            def handle_console(msg):
                if "XSS_TRIGGERED" in msg.text:
                    self.xss_triggered = True

            page.on("console", handle_console)

            # Reload to render the malicious data
            page.reload()

            # Wait for the table to populate
            try:
                page.wait_for_selector("#leaderboard-table")
            except:
                pass

            content = page.content()

            # Assert XSS was NOT triggered
            self.assertFalse(self.xss_triggered, "XSS triggered via console log")

            # Assert malicious tag is not in HTML (it should be escaped)
            self.assertNotIn('<img src="x" onerror="console.log(\'XSS_TRIGGERED\')">', content)

            # Assert escaped version is present
            self.assertIn('&lt;img', content)

            browser.close()

if __name__ == "__main__":
    unittest.main()
