print("Hello, World!")
print("This is a test script.")

import sys
print(f"Python version: {sys.version}")
print(f"Python path: {sys.path}")

try:
    import requests
    print(f"Requests version: {requests.__version__}")
except ImportError:
    print("Requests module not found.")

try:
    import playwright
    print(f"Playwright version: {playwright.__version__}")
except ImportError:
    print("Playwright module not found.")

print("Test script completed.")