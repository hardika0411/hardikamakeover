// Admin Dashboard JavaScript
let allContacts = [];
let filteredContacts = [];

// Initialize admin dashboard
document.addEventListener('DOMContentLoaded', function() {
    initializeAdmin();
    loadDashboardData();
    setupEventListeners();
});

function initializeAdmin() {
    // Set up navigation
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.getAttribute('data-section');
            showSection(section);
            
            // Update active nav
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

function showSection(sectionName) {
    const sections = document.querySelectorAll('.admin-section');
    sections.forEach(section => {
        section.style.display = 'none';
    });
    
    const targetSection = document.getElementById(sectionName);
    if (targetSection) {
        targetSection.style.display = 'block';
        
        if (sectionName === 'contacts') {
            loadContacts();
        } else if (sectionName === 'dashboard') {
            loadDashboardStats();
        }
    }
}

function setupEventListeners() {
    // Search and filter functionality
    document.getElementById('searchInput').addEventListener('input', filterContacts);
    document.getElementById('statusFilter').addEventListener('change', filterContacts);
    document.getElementById('serviceFilter').addEventListener('change', filterContacts);
}

async function loadDashboardData() {
    try {
        // Try to load from server first
        const response = await fetch('/api/stats');
        if (response.ok) {
            const stats = await response.json();
            updateDashboardStats(stats);
        } else {
            // Fallback to local storage
            loadLocalStats();
        }
    } catch (error) {
        console.log('Server not available, loading local data');
        loadLocalStats();
    }
}

function loadLocalStats() {
    const localContacts = JSON.parse(localStorage.getItem('hardika_contacts') || '[]');
    
    const stats = {
        total_contacts: localContacts.length,
        status_counts: {},
        service_counts: {},
        recent_contacts: 0
    };
    
    // Calculate stats from local data
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    localContacts.forEach(contact => {
        // Status counts
        const status = contact.status || 'new';
        stats.status_counts[status] = (stats.status_counts[status] || 0) + 1;
        
        // Service counts
        const service = contact.service || 'other';
        stats.service_counts[service] = (stats.service_counts[service] || 0) + 1;
        
        // Recent contacts
        const contactDate = new Date(contact.timestamp);
        if (contactDate > oneWeekAgo) {
            stats.recent_contacts++;
        }
    });
    
    updateDashboardStats(stats);
}

function updateDashboardStats(stats) {
    document.getElementById('totalContacts').textContent = stats.total_contacts || 0;
    document.getElementById('newContacts').textContent = stats.status_counts?.new || 0;
    document.getElementById('recentContacts').textContent = stats.recent_contacts || 0;
    
    // Find most popular service
    let popularService = 'None';
    let maxCount = 0;
    for (const [service, count] of Object.entries(stats.service_counts || {})) {
        if (count > maxCount) {
            maxCount = count;
            popularService = service.charAt(0).toUpperCase() + service.slice(1);
        }
    }
    document.getElementById('popularService').textContent = popularService;
}

async function loadContacts() {
    const contactsList = document.getElementById('contactsList');
    contactsList.innerHTML = '<div class="loading"><i class="fas fa-spinner"></i><p>Loading contacts...</p></div>';
    
    try {
        // Try to load from server first
        const response = await fetch('/api/contacts');
        if (response.ok) {
            allContacts = await response.json();
        } else {
            // Fallback to local storage
            allContacts = JSON.parse(localStorage.getItem('hardika_contacts') || '[]');
        }
    } catch (error) {
        console.log('Server not available, loading local data');
        allContacts = JSON.parse(localStorage.getItem('hardika_contacts') || '[]');
    }
    
    filteredContacts = [...allContacts];
    displayContacts();
}

function displayContacts() {
    const contactsList = document.getElementById('contactsList');
    
    if (filteredContacts.length === 0) {
        contactsList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-inbox"></i>
                <h3>No contacts found</h3>
                <p>No contacts match your current filters.</p>
            </div>
        `;
        return;
    }
    
    const contactsHTML = filteredContacts.map(contact => {
        const date = new Date(contact.timestamp || contact.created_at).toLocaleDateString();
        const status = contact.status || 'new';
        
        return `
            <div class="contact-row">
                <div><strong>${contact.name}</strong></div>
                <div>${contact.email}</div>
                <div>${contact.service || 'Not specified'}</div>
                <div>${date}</div>
                <div>
                    <span class="status-badge status-${status}">${status.toUpperCase()}</span>
                </div>
                <div class="contact-actions">
                    <button class="btn-success" onclick="viewContact('${contact.id || contact.client_id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-warning" onclick="updateContactStatus('${contact.id || contact.client_id}', 'contacted')">
                        <i class="fas fa-phone"></i>
                    </button>
                    <button class="btn-danger" onclick="deleteContact('${contact.id || contact.client_id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    }).join('');
    
    contactsList.innerHTML = contactsHTML;
}

function filterContacts() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const statusFilter = document.getElementById('statusFilter').value;
    const serviceFilter = document.getElementById('serviceFilter').value;
    
    filteredContacts = allContacts.filter(contact => {
        const matchesSearch = !searchTerm || 
            contact.name.toLowerCase().includes(searchTerm) ||
            contact.email.toLowerCase().includes(searchTerm) ||
            (contact.message && contact.message.toLowerCase().includes(searchTerm));
        
        const matchesStatus = !statusFilter || (contact.status || 'new') === statusFilter;
        const matchesService = !serviceFilter || contact.service === serviceFilter;
        
        return matchesSearch && matchesStatus && matchesService;
    });
    
    displayContacts();
}

function viewContact(contactId) {
    const contact = allContacts.find(c => (c.id || c.client_id) === contactId);
    if (!contact) return;
    
    const modal = document.getElementById('contactModal');
    const detailsContainer = document.getElementById('contactDetails');
    
    const detailsHTML = `
        <div class="detail-group">
            <div class="detail-label">Name:</div>
            <div class="detail-value">${contact.name}</div>
        </div>
        <div class="detail-group">
            <div class="detail-label">Email:</div>
            <div class="detail-value"><a href="mailto:${contact.email}" style="color: var(--gold);">${contact.email}</a></div>
        </div>
        <div class="detail-group">
            <div class="detail-label">Phone:</div>
            <div class="detail-value">
                ${contact.phone ? `<a href="tel:${contact.phone}" style="color: var(--gold);">${contact.phone}</a>` : 'Not provided'}
            </div>
        </div>
        <div class="detail-group">
            <div class="detail-label">Service:</div>
            <div class="detail-value">${contact.service || 'Not specified'}</div>
        </div>
        <div class="detail-group">
            <div class="detail-label">Message:</div>
            <div class="detail-value">${contact.message || 'No message provided'}</div>
        </div>
        <div class="detail-group">
            <div class="detail-label">Status:</div>
            <div class="detail-value">
                <span class="status-badge status-${contact.status || 'new'}">${(contact.status || 'new').toUpperCase()}</span>
            </div>
        </div>
        <div class="detail-group">
            <div class="detail-label">Submitted:</div>
            <div class="detail-value">${new Date(contact.timestamp || contact.created_at).toLocaleString()}</div>
        </div>
        <div class="detail-group">
            <div class="detail-label">WhatsApp:</div>
            <div class="detail-value">
                <a href="https://wa.me/918169263774?text=Hi ${contact.name}, regarding your ${contact.service} inquiry..." 
                   target="_blank" class="btn btn-success" style="text-decoration: none;">
                    <i class="fab fa-whatsapp"></i> Contact via WhatsApp
                </a>
            </div>
        </div>
    `;
    
    detailsContainer.innerHTML = detailsHTML;
    modal.style.display = 'block';
}

function closeModal() {
    document.getElementById('contactModal').style.display = 'none';
}

async function updateContactStatus(contactId, newStatus) {
    try {
        // Try to update on server
        const response = await fetch(`/api/contacts/${contactId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: newStatus })
        });
        
        if (response.ok) {
            console.log('Status updated on server');
        }
    } catch (error) {
        console.log('Server not available, updating locally only');
    }
    
    // Update local data
    const contact = allContacts.find(c => (c.id || c.client_id) === contactId);
    if (contact) {
        contact.status = newStatus;
        
        // Update localStorage
        const localContacts = JSON.parse(localStorage.getItem('hardika_contacts') || '[]');
        const localContact = localContacts.find(c => c.id === contactId);
        if (localContact) {
            localContact.status = newStatus;
            localStorage.setItem('hardika_contacts', JSON.stringify(localContacts));
        }
        
        displayContacts();
        showNotification(`Contact status updated to ${newStatus}`, 'success');
    }
}

async function deleteContact(contactId) {
    if (!confirm('Are you sure you want to delete this contact?')) return;
    
    try {
        // Try to delete from server
        const response = await fetch(`/api/contacts/${contactId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            console.log('Contact deleted from server');
        }
    } catch (error) {
        console.log('Server not available, deleting locally only');
    }
    
    // Remove from local arrays
    allContacts = allContacts.filter(c => (c.id || c.client_id) !== contactId);
    filteredContacts = filteredContacts.filter(c => (c.id || c.client_id) !== contactId);
    
    // Update localStorage
    const localContacts = JSON.parse(localStorage.getItem('hardika_contacts') || '[]');
    const updatedLocalContacts = localContacts.filter(c => c.id !== contactId);
    localStorage.setItem('hardika_contacts', JSON.stringify(updatedLocalContacts));
    
    displayContacts();
    showNotification('Contact deleted successfully', 'success');
}

function refreshContacts() {
    loadContacts();
    loadDashboardStats();
    showNotification('Data refreshed', 'success');
}

function clearLocalStorage() {
    if (!confirm('Are you sure you want to clear all local contact data? This cannot be undone.')) return;
    
    localStorage.removeItem('hardika_contacts');
    allContacts = [];
    filteredContacts = [];
    displayContacts();
    loadDashboardStats();
    showNotification('Local data cleared', 'success');
}

function exportData() {
    const dataToExport = {
        contacts: allContacts,
        exported_at: new Date().toISOString(),
        total_contacts: allContacts.length
    };
    
    const dataStr = JSON.stringify(dataToExport, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `hardika_contacts_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    showNotification('Data exported successfully', 'success');
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? 'linear-gradient(45deg, #28a745, #20c997)' : 'linear-gradient(45deg, var(--gold), var(--dark-gold))'};
        color: var(--primary-black);
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        z-index: 2000;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-weight: 600;
        transform: translateX(400px);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('contactModal');
    if (event.target === modal) {
        closeModal();
    }
}

// Load dashboard by default
showSection('dashboard');
