import os

# Render dynamically assigns a port via the PORT environment variable.
# Gunicorn automatically loads this gunicorn.conf.py file from the root directory.
port = os.environ.get("PORT", "8000")
bind = f"0.0.0.0:{port}"

workers = 1
threads = 4
timeout = 120
keepalive = 5
