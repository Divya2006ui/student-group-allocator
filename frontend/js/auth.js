const API_BASE = 'http://localhost:8080/api';

document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const loginData = {
        username: formData.get('username'),
        password: formData.get('password'),
        userType: formData.get('userType')
    };
    
    showLoading(true);
    
    try {
        const response = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(loginData)
        });
        
        const result = await response.json();
        
        if (response.ok) {
            localStorage.setItem('token', result.token);
            localStorage.setItem('userType', loginData.userType);
            
            if (loginData.userType === 'admin') {
                window.location.href = 'admin.html';
            } else {
                window.location.href = 'groups.html';
            }
        } else {
            alert(result.message || 'Login failed');
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

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    window.location.href = 'index.html';
}