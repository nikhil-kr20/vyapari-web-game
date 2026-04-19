import time
from playwright.sync_api import sync_playwright

def verify():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        page.goto("http://localhost:5173")
        time.sleep(1)

        start_btn = page.locator("button.start-btn")
        start_btn.click()
        time.sleep(1)

        dice_area = page.locator(".dice-area.active")
        dice_area.click(force=True)
        time.sleep(3)

        page.screenshot(path="/tmp/board_verification_final.png")
        browser.close()

if __name__ == "__main__":
    verify()
