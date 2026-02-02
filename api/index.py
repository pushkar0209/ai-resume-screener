import sys
import os

# Add the parent directory to sys.path to allow imports from root
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import app

# Vercel Serverless Function entry point
# It automatically picks up the 'app' object as the WSGI application
