const fetch = require('node-fetch');

async function testAdmin() {
  try {
    // Login as admin
    const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: 'admin',
        password: 'admin123'
      })
    });

    const loginData = await loginResponse.json();
    console.log('Login response:', loginData);

    if (loginData.token) {
      // Test job applications endpoint
      const appsResponse = await fetch('http://localhost:5000/api/job-applications', {
        headers: {
          'Authorization': `Bearer ${loginData.token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Applications response status:', appsResponse.status);
      const appsData = await appsResponse.json();
      console.log('Applications data:', JSON.stringify(appsData, null, 2));
    }

  } catch (error) {
    console.error('Test failed:', error);
  }
}

testAdmin();