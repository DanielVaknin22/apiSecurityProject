async function register() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    if (!username || !password) {
        alert('Please fill in both fields');
        return;
      }
    try {
        const response = await fetch('https://localhost:3000/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
      
        if (!response.ok) {
            throw new Error('Failed to register');
        }
      
        const result = await response.text();
        alert(result);
        window.location.href = 'login.html';
    } catch (error) {
        console.error('Error:', error);
    }
}
  
async function handleLogin() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    if (!username || !password) {
        alert('Please fill in both fields');
        return;
      }
    try {
        const token = await login(username, password);
        console.log('Login successful:', token);
        localStorage.setItem('token', token);
        alert('Login successful!');
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Failed to login:', error);
    }
}
  
async function login(username, password) {
    try {
        const response = await fetch('https://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        if (!response.ok) throw new Error('Failed to login');

        const data = await response.json();
        return data.token;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

function logout() {
    localStorage.removeItem('token');
  
    window.location.href = 'login.html';
  }

async function getApiKey() {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Please login first');
        return;
    }

    try {
        const response = await fetch('https://localhost:3000/apikey', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) throw new Error('Failed to get API key');

        const result = await response.json();
        document.getElementById('apiKey').innerText = result.apiKey;
    } catch (error) {
        console.error('Error:', error);
        alert('Error: ' + error.message);

    }
}
  
async function getSecureData() {
    const apiKey = document.getElementById('apiKey').innerText;
  
    if (!apiKey) {
      alert('Please get an API key first');
      return;
    }
  
    try {
      const response = await fetch('https://localhost:3000/secure-data', {
        headers: {
          'x-api-key': apiKey
        }
      });
  
      if (!response.ok) {
        console.error('Response status:', response.status);
        throw new Error('Failed to get secure data');
      }
  
      const result = await response.json();
      document.getElementById('secureData').innerText = result.data;
    } catch (error) {
      console.error('Error:', error);
      alert('Error: ' + error.message);
    }
  }
  
