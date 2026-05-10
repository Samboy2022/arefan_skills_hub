from playwright.sync_api import sync_playwright, expect
import time
import os

os.makedirs("/home/jules/verification", exist_ok=True)

def verify_all_pages():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Set viewport for desktop view
        context = browser.new_context(viewport={"width": 1280, "height": 800})
        page = context.new_page()

        print("Testing Index/Landing Page...")
        page.goto("http://localhost:3000/")
        page.wait_for_load_state("networkidle")
        time.sleep(2) # wait for animation
        page.screenshot(path="/home/jules/verification/landing.png", full_page=True)

        print("Testing About Page...")
        page.goto("http://localhost:3000/about")
        page.wait_for_load_state("networkidle")
        page.screenshot(path="/home/jules/verification/about.png", full_page=True)

        print("Testing Community Page...")
        page.goto("http://localhost:3000/community")
        page.wait_for_load_state("networkidle")
        page.screenshot(path="/home/jules/verification/community.png", full_page=True)

        print("Testing Careers Page...")
        page.goto("http://localhost:3000/careers")
        page.wait_for_load_state("networkidle")
        page.screenshot(path="/home/jules/verification/careers.png", full_page=True)

        print("Testing Changelog Page...")
        page.goto("http://localhost:3000/changelog")
        page.wait_for_load_state("networkidle")
        page.screenshot(path="/home/jules/verification/changelog.png", full_page=True)

        print("Testing Privacy Policy Page...")
        page.goto("http://localhost:3000/privacy")
        page.wait_for_load_state("networkidle")
        page.screenshot(path="/home/jules/verification/privacy.png", full_page=True)

        print("Testing Terms of Service Page...")
        page.goto("http://localhost:3000/terms")
        page.wait_for_load_state("networkidle")
        page.screenshot(path="/home/jules/verification/terms.png", full_page=True)

        print("Testing Pricing Page...")
        page.goto("http://localhost:3000/pricing")
        page.wait_for_load_state("networkidle")
        page.screenshot(path="/home/jules/verification/pricing.png", full_page=True)

        print("Testing Documentation Overview Page...")
        page.goto("http://localhost:3000/documentation")
        page.wait_for_load_state("networkidle")
        page.screenshot(path="/home/jules/verification/documentation.png", full_page=True)

        print("Testing Documentation Nested Page (Student Assignments)...")
        page.goto("http://localhost:3000/documentation/student/assignments")
        page.wait_for_load_state("networkidle")
        page.screenshot(path="/home/jules/verification/doc-nested.png", full_page=True)

        # Test Mobile Viewport
        print("Testing Mobile Nav...")
        mobile_context = browser.new_context(viewport={"width": 375, "height": 667})
        mobile_page = mobile_context.new_page()
        mobile_page.goto("http://localhost:3000/")
        mobile_page.wait_for_load_state("networkidle")
        mobile_page.get_by_role("button", name="Toggle Menu").click()
        time.sleep(1) # wait for menu
        mobile_page.screenshot(path="/home/jules/verification/mobile-nav.png")

        browser.close()
        print("Verification complete.")

if __name__ == "__main__":
    verify_all_pages()
