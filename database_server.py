#!/usr/bin/env python3
import http.server
import socketserver
import webbrowser
import os
import json
import sqlite3
from datetime import datetime

PORT = 8001
DB_FILE = 'hardika_contacts.db'

class DatabaseContactHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        self.init_database()
        super().__init__(*args, **kwargs)
    
    def init_database(self):
        """Initialize SQLite database and create table if not exists"""
        try:
            conn = sqlite3.connect(DB_FILE)
            cursor = conn.cursor()
            
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS contacts (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    client_id TEXT UNIQUE,
                    name TEXT NOT NULL,
                    email TEXT NOT NULL,
                    phone TEXT,
                    service TEXT,
                    message TEXT,
                    status TEXT DEFAULT 'new',
                    client_timestamp TEXT,
                    server_timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            ''')
            
            conn.commit()
            conn.close()
            print("Database initialized successfully")
        except Exception as e:
            print(f"Error initializing database: {e}")
    
    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')
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
        elif self.path.startswith('/api/contacts/'):
            contact_id = self.path.split('/')[-1]
            self.handle_get_contact(contact_id)
        elif self.path == '/admin':
            self.serve_admin_page()
        elif self.path == '/api/stats':
            self.handle_get_stats()
        else:
            super().do_GET()
    
    def do_PUT(self):
        if self.path.startswith('/api/contacts/'):
            contact_id = self.path.split('/')[-1]
            self.handle_update_contact(contact_id)
    
    def do_DELETE(self):
        if self.path.startswith('/api/contacts/'):
            contact_id = self.path.split('/')[-1]
            self.handle_delete_contact(contact_id)
    
    def handle_contact_submission(self):
        try:
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            contact_data = json.loads(post_data.decode('utf-8'))
            
            conn = sqlite3.connect(DB_FILE)
            cursor = conn.cursor()
            
            cursor.execute('''
                INSERT INTO contacts 
                (client_id, name, email, phone, service, message, status, client_timestamp, server_timestamp)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                contact_data.get('id'),
                contact_data.get('name'),
                contact_data.get('email'),
                contact_data.get('phone'),
                contact_data.get('service'),
                contact_data.get('message'),
                contact_data.get('status', 'new'),
                contact_data.get('timestamp'),
                datetime.now().isoformat()
            ))
            
            contact_id = cursor.lastrowid
            conn.commit()
            conn.close()
            
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({
                'status': 'success', 
                'message': 'Contact saved to database',
                'id': contact_id
            }).encode())
            
            print(f"New contact saved to database: {contact_data['name']} - {contact_data['email']}")
            
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'status': 'error', 'message': str(e)}).encode())
            print(f"Error saving contact to database: {e}")
    
    def handle_get_contacts(self):
        try:
            conn = sqlite3.connect(DB_FILE)
            cursor = conn.cursor()
            
            cursor.execute('''
                SELECT id, client_id, name, email, phone, service, message, status, 
                       client_timestamp, server_timestamp, created_at
                FROM contacts 
                ORDER BY created_at DESC
            ''')
            
            contacts = []
            for row in cursor.fetchall():
                contacts.append({
                    'id': row[0],
                    'client_id': row[1],
                    'name': row[2],
                    'email': row[3],
                    'phone': row[4],
                    'service': row[5],
                    'message': row[6],
                    'status': row[7],
                    'client_timestamp': row[8],
                    'server_timestamp': row[9],
                    'created_at': row[10]
                })
            
            conn.close()
            
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(contacts).encode())
            
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'error': str(e)}).encode())
    
    def handle_get_contact(self, contact_id):
        try:
            conn = sqlite3.connect(DB_FILE)
            cursor = conn.cursor()
            
            cursor.execute('''
                SELECT id, client_id, name, email, phone, service, message, status, 
                       client_timestamp, server_timestamp, created_at
                FROM contacts 
                WHERE id = ?
            ''', (contact_id,))
            
            row = cursor.fetchone()
            conn.close()
            
            if row:
                contact = {
                    'id': row[0],
                    'client_id': row[1],
                    'name': row[2],
                    'email': row[3],
                    'phone': row[4],
                    'service': row[5],
                    'message': row[6],
                    'status': row[7],
                    'client_timestamp': row[8],
                    'server_timestamp': row[9],
                    'created_at': row[10]
                }
                
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps(contact).encode())
            else:
                self.send_response(404)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'error': 'Contact not found'}).encode())
                
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'error': str(e)}).encode())
    
    def handle_update_contact(self, contact_id):
        try:
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            update_data = json.loads(post_data.decode('utf-8'))
            
            conn = sqlite3.connect(DB_FILE)
            cursor = conn.cursor()
            
            cursor.execute('''
                UPDATE contacts 
                SET status = ?
                WHERE id = ?
            ''', (update_data.get('status'), contact_id))
            
            conn.commit()
            conn.close()
            
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'status': 'success', 'message': 'Contact updated'}).encode())
            
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'error': str(e)}).encode())
    
    def handle_delete_contact(self, contact_id):
        try:
            conn = sqlite3.connect(DB_FILE)
            cursor = conn.cursor()
            
            cursor.execute('DELETE FROM contacts WHERE id = ?', (contact_id,))
            
            conn.commit()
            conn.close()
            
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'status': 'success', 'message': 'Contact deleted'}).encode())
            
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'error': str(e)}).encode())
    
    def handle_get_stats(self):
        try:
            conn = sqlite3.connect(DB_FILE)
            cursor = conn.cursor()
            
            # Get total contacts
            cursor.execute('SELECT COUNT(*) FROM contacts')
            total_contacts = cursor.fetchone()[0]
            
            # Get contacts by status
            cursor.execute('SELECT status, COUNT(*) FROM contacts GROUP BY status')
            status_counts = dict(cursor.fetchall())
            
            # Get contacts by service
            cursor.execute('SELECT service, COUNT(*) FROM contacts GROUP BY service')
            service_counts = dict(cursor.fetchall())
            
            # Get recent contacts (last 7 days)
            cursor.execute('''
                SELECT COUNT(*) FROM contacts 
                WHERE created_at >= datetime('now', '-7 days')
            ''')
            recent_contacts = cursor.fetchone()[0]
            
            conn.close()
            
            stats = {
                'total_contacts': total_contacts,
                'status_counts': status_counts,
                'service_counts': service_counts,
                'recent_contacts': recent_contacts
            }
            
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(stats).encode())
            
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'error': str(e)}).encode())
    
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
            self.wfile.write(b'<h1>Database Admin Dashboard Not Found</h1><p>Please ensure admin.html exists.</p>')

def start_server():
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    with socketserver.TCPServer(("", PORT), DatabaseContactHandler) as httpd:
        print(f"Serving Hardika Makeover website with DATABASE at http://localhost:{PORT}")
        print(f"Database admin dashboard at http://localhost:{PORT}/admin")
        print(f"API endpoints available at http://localhost:{PORT}/api/contacts")
        print("Press Ctrl+C to stop the server")
        
        # Open browser automatically
        webbrowser.open(f'http://localhost:{PORT}')
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nDatabase server stopped.")
            httpd.shutdown()

if __name__ == "__main__":
    start_server()
