const API_BASE = 'http://localhost:8080/api';

document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    loadGroups();
});

function checkAuth() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'index.html';
    }
}

async function loadGroups() {
    try {
        const response = await fetch(`${API_BASE}/groups`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        
        const groups = await response.json();
        displayGroups(groups);
        updateStats(groups);
    } catch (error) {
        console.error('Error loading groups:', error);
    }
}

function displayGroups(groups) {
    const container = document.getElementById('groupsDisplay');
    
    if (groups.length === 0) {
        container.innerHTML = '<p>No groups allocated yet. Contact your administrator.</p>';
        return;
    }
    
    const groupsHTML = groups.map(group => `
        <div class="group-card">
            <div class="group-header">
                <i class="fas fa-users"></i>
                <h3>${group.name}</h3>
                <span class="member-count">${group.members.length} members</span>
            </div>
            <ul class="member-list">
                ${group.members.map(member => `
                    <li>
                        <div class="member-info">
                            <strong>${member.firstName} ${member.lastName}</strong>
                            <span class="roll-number">${member.rollNumber}</span>
                        </div>
                        <div class="member-skills">
                            ${member.skills.slice(0, 3).map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                        </div>
                    </li>
                `).join('')}
            </ul>
        </div>
    `).join('');
    
    container.innerHTML = groupsHTML;
}

function updateStats(groups) {
    const totalGroups = groups.length;
    const totalStudents = groups.reduce((sum, group) => sum + group.members.length, 0);
    
    document.getElementById('totalGroups').textContent = totalGroups;
    document.getElementById('totalStudents').textContent = totalStudents;
}

function exportPDF() {
    alert('PDF export feature will be implemented with jsPDF library');
}

function exportCSV() {
    fetch(`${API_BASE}/groups/export/csv`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
    .then(response => response.blob())
    .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'groups.csv';
        a.click();
    })
    .catch(error => console.error('Export failed:', error));
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    window.location.href = 'index.html';
}