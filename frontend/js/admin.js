const API_BASE = 'http://localhost:8080/api';
let students = [];
let groups = [];

document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    loadStudents();
});

function checkAuth() {
    const token = localStorage.getItem('token');
    const userType = localStorage.getItem('userType');
    
    if (!token || userType !== 'admin') {
        window.location.href = 'index.html';
    }
}

function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-menu a').forEach(a => a.classList.remove('active'));
    
    document.getElementById(sectionId).classList.add('active');
    document.querySelector(`[onclick="showSection('${sectionId}')"]`).classList.add('active');
    
    if (sectionId === 'groups') loadGroups();
}

async function loadStudents() {
    try {
        const response = await fetch(`${API_BASE}/students`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        
        students = await response.json();
        displayStudents(students);
    } catch (error) {
        console.error('Error loading students:', error);
    }
}

function displayStudents(studentList) {
    const container = document.getElementById('studentsTable');
    
    if (studentList.length === 0) {
        container.innerHTML = '<p>No students registered yet.</p>';
        return;
    }
    
    const table = `
        <table class="table">
            <thead>
                <tr>
                    <th>Roll No</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Skills</th>
                    <th>Group</th>
                </tr>
            </thead>
            <tbody>
                ${studentList.map(student => `
                    <tr>
                        <td>${student.rollNumber}</td>
                        <td>${student.firstName} ${student.lastName}</td>
                        <td>${student.email}</td>
                        <td>${student.skills.join(', ')}</td>
                        <td>${student.groupId || 'Not Assigned'}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    
    container.innerHTML = table;
}

function searchStudents() {
    const query = document.getElementById('searchStudents').value.toLowerCase();
    const filtered = students.filter(student => 
        student.firstName.toLowerCase().includes(query) ||
        student.lastName.toLowerCase().includes(query) ||
        student.rollNumber.toLowerCase().includes(query) ||
        student.email.toLowerCase().includes(query)
    );
    displayStudents(filtered);
}

async function loadGroups() {
    try {
        const response = await fetch(`${API_BASE}/groups`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        
        groups = await response.json();
        displayGroups(groups);
    } catch (error) {
        console.error('Error loading groups:', error);
    }
}

function displayGroups(groupList) {
    const container = document.getElementById('groupsContainer');
    
    if (groupList.length === 0) {
        container.innerHTML = '<p>No groups created yet. Use the allocation feature to create groups.</p>';
        return;
    }
    
    const groupsHTML = groupList.map(group => `
        <div class="group-card">
            <div class="group-header">
                <i class="fas fa-users"></i>
                <h3>${group.name}</h3>
            </div>
            <ul class="member-list">
                ${group.members.map(member => `
                    <li><strong>${member.rollNumber}</strong> - ${member.firstName} ${member.lastName}</li>
                `).join('')}
            </ul>
        </div>
    `).join('');
    
    container.innerHTML = `<div class="groups-grid">${groupsHTML}</div>`;
}

async function allocateGroups() {
    const method = document.getElementById('allocationMethod').value;
    const size = parseInt(document.getElementById('groupSize').value);
    
    if (students.length === 0) {
        alert('No students available for allocation');
        return;
    }
    
    showProgress(true);
    
    try {
        const response = await fetch(`${API_BASE}/groups/allocate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ method, groupSize: size })
        });
        
        const result = await response.json();
        
        if (response.ok) {
            alert(`Successfully created ${result.groupCount} groups!`);
            loadGroups();
            loadStudents();
        } else {
            alert(result.message || 'Allocation failed');
        }
    } catch (error) {
        alert('Connection error. Please try again.');
    } finally {
        showProgress(false);
    }
}

function showProgress(show) {
    document.getElementById('allocationProgress').style.display = show ? 'block' : 'none';
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    window.location.href = 'index.html';
}