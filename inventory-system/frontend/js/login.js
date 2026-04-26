const API_URL = 'http://localhost:5000/api/auth';

function switchTab(tab) {
  document.getElementById('tab-login').classList.remove('active');
  document.getElementById('tab-register').classList.remove('active');
  document.getElementById('form-login').classList.remove('active');
  document.getElementById('form-register').classList.remove('active');
  
  document.getElementById('loginMsg').innerText = '';
  document.getElementById('regMsg').innerText = '';

  document.getElementById(`tab-${tab}`).classList.add('active');
  document.getElementById(`form-${tab}`).classList.add('active');
}

async function handleLogin() {
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value.trim();
  const msgEl = document.getElementById('loginMsg');

  if (!email || !password) {
    msgEl.innerText = 'Please enter both email and password.';
    msgEl.className = 'auth-msg msg-error';
    return;
  }

  msgEl.innerText = 'Authenticating...';
  msgEl.className = 'auth-msg';

  try {
    const res = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    const data = await res.json();
    
    if (res.ok) {
      msgEl.innerText = 'Success! Redirecting...';
      msgEl.className = 'auth-msg msg-success';
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1000);
    } else {
      msgEl.innerText = data.message || 'Login failed';
      msgEl.className = 'auth-msg msg-error';
    }
  } catch (error) {
    msgEl.innerText = 'Server connection error.';
    msgEl.className = 'auth-msg msg-error';
  }
}

async function handleRegister() {
  const name = document.getElementById('regName').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const role = document.getElementById('regRole').value;
  const password = document.getElementById('regPassword').value.trim();
  const msgEl = document.getElementById('regMsg');

  if (!name || !email || !password) {
    msgEl.innerText = 'Please fill all fields.';
    msgEl.className = 'auth-msg msg-error';
    return;
  }

  msgEl.innerText = 'Registering...';
  msgEl.className = 'auth-msg';

  try {
    const res = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, role, password })
    });
    
    const data = await res.json();
    
    if (res.ok) {
      msgEl.innerText = 'Registration successful! Redirecting...';
      msgEl.className = 'auth-msg msg-success';
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1000);
    } else {
      msgEl.innerText = data.message || 'Registration failed';
      msgEl.className = 'auth-msg msg-error';
    }
  } catch (error) {
    msgEl.innerText = 'Server connection error.';
    msgEl.className = 'auth-msg msg-error';
  }
}

// Clear previous session so you can test the login screen
window.onload = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};
