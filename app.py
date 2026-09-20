import os
import sys
import uvicorn

# Ensure backend directory is in python sys.path
backend_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "backend")
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from core.main import app
from core.config import settings

if __name__ == "__main__":
    port = int(os.environ.get("PORT", settings.SERVER_PORT))
    uvicorn.run(app, host="0.0.0.0", port=port)
