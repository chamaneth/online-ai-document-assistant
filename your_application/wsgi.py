import os
import sys

# Ensure root and backend directory are in sys.path
root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
backend_dir = os.path.join(root_dir, "backend")

for path in [root_dir, backend_dir]:
    if path not in sys.path:
        sys.path.insert(0, path)

from core.main import app as asgi_app

try:
    from a2wsgi import ASGIMiddleware
    application = ASGIMiddleware(asgi_app)
except Exception:
    application = asgi_app

app = asgi_app
wsgi = application
