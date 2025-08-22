#!/usr/bin/env python3
"""
Development server for K-Factor Calculator
- Serves on port 8080
- No caching headers
- Auto-unregisters service workers
"""

import http.server
import socketserver
import os

class NoCacheHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Add headers to prevent caching
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()
    
    def do_GET(self):
        # Serve from current directory
        super().do_GET()

PORT = 8080
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

os.chdir(DIRECTORY)

with socketserver.TCPServer(("", PORT), NoCacheHTTPRequestHandler) as httpd:
    print(f"🚀 Development server running at http://localhost:{PORT}")
    print("📱 For iPhone simulator: http://localhost:8080")
    print("🔄 No caching - changes appear immediately")
    print("⚠️  Service worker disabled on localhost")
    print("\nPress Ctrl+C to stop...")
    httpd.serve_forever()