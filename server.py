#!/usr/bin/env python3
import http.server
import socketserver
import webbrowser
import os
import json
import urllib.parse
from datetime import datetime

PORT = 8000
CONTACTS_FILE = 'contacts.json'

class ContactHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def do_POST(self):
        if self.path == '/api/contacts':
            self.handle_contact_submission()
        else:
            super().do_POST()

    def do_GET(self):
        if self.path == '/api/contacts':
            self.handle_get_contacts()
        elif self.path == '/admin':
            self.serve_admin_page()
        else:
            super().do_GET()

    def handle_contact_submission(self):
        try:
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            contact_data = json.loads(post_data.decode('utf-8'))

            # Add server timestamp
            contact_data['server_timestamp'] = datetime.now().isoformat()

            # Load existing contacts
            contacts = self.load_contacts()

            # Add new contact
            contacts.append(contact_data)

            # Save to file
            self.save_contacts(contacts)

            # Send success response
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'status': 'success', 'message': 'Contact saved'}).encode())

            print(f"New contact saved: {contact_data['name']} - {contact_data['email']}")

        except Exception as e:
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'status': 'error', 'message': str(e)}).encode())
            print(f"Error saving contact: {e}")

    def handle_get_contacts(self):
        try:
            contacts = self.load_contacts()
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(contacts).encode())
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'error': str(e)}).encode())

    def load_contacts(self):
        try:
            if os.path.exists(CONTACTS_FILE):
                with open(CONTACTS_FILE, 'r', encoding='utf-8') as f:
                    return json.load(f)
            return []
        except Exception as e:
            print(f"Error loading contacts: {e}")
            return []

    def save_contacts(self, contacts):
        try:
            with open(CONTACTS_FILE, 'w', encoding='utf-8') as f:
                json.dump(contacts, f, indent=2, ensure_ascii=False)
        except Exception as e:
            print(f"Error saving contacts: {e}")
            raise

    def serve_admin_page(self):
        try:
            with open('admin.html', 'r', encoding='utf-8') as f:
                content = f.read()
            self.send_response(200)
            self.send_header('Content-Type', 'text/html')
            self.end_headers()
            self.wfile.write(content.encode('utf-8'))
        except FileNotFoundError:
            self.send_response(404)
            self.send_header('Content-Type', 'text/html')
            self.end_headers()
            self.wfile.write(b'<h1>Admin Dashboard Not Found</h1><p>Please ensure admin.html exists.</p>')

def start_server():
    os.chdir(os.path.dirname(os.path.abspath(__file__)))

    with socketserver.TCPServer(("", PORT), ContactHandler) as httpd:
        print(f"Serving Hardika Makeover website at http://localhost:{PORT}")
        print(f"Admin dashboard at http://localhost:{PORT}/admin")
        print("Press Ctrl+C to stop the server")

        # Open browser automatically
        webbrowser.open(f'http://localhost:{PORT}')

        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer stopped.")
            httpd.shutdown()

if __name__ == "__main__":
    start_server()
