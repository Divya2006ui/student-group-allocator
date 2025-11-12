const API_BASE = 'http://localhost:8080/api';

document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    
    if (formData.get('password') !== formData.get('confirmPassword')) {
        alert('Passwords do not match');
        return;
    }
    
    const studentData = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        rollNumber: formData.get('rollNumber'),
        email: formData.get('email'),
        skills: formData.get('skills').split(',').map(s => s.trim()),
        interests: formData.get('interests'),
        password: formData.get('password')
    };
    
    showLoading(true);
    
    try {
        const response = await fetch(`${API_BASE}/students/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(studentData)
        });
        
        const result = await response.json();
        
        if (response.ok) {
            alert('Registration successful! Please login.');
            window.location.href = 'index.html';
        } else {
            alert(result.message || 'Registration failed');
        }
    } catch (error) {
        alert('Connection error. Please try again.');
    } finally {
        showLoading(false);
    }
});

function showLoading(show) {
    document.getElementById('loadingSpinner').style.display = show ? 'flex' : 'none';
}