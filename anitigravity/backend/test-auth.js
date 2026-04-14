const email = 'admin@glamcart.com';
const password = 'Admin@123';
fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
}).then(r => r.json()).then(data => {
  console.log('Login Response:', data);
}).catch(console.error);
