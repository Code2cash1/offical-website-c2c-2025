const fetch = require('node-fetch');

async function testDashboard() {
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
    console.log('Login successful:', loginData.token ? 'yes' : 'no');

    if (loginData.token) {
      // Test dashboard endpoint
      const dashboardResponse = await fetch('http://localhost:5000/api/admin/dashboard', {
        headers: {
          'Authorization': `Bearer ${loginData.token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Dashboard response status:', dashboardResponse.status);
      
      if (dashboardResponse.ok) {
        const dashboardData = await dashboardResponse.json();
        console.log('Dashboard data:', JSON.stringify(dashboardData, null, 2));
      } else {
        const errorText = await dashboardResponse.text();
        console.error('Dashboard error:', errorText);
      }
    }

  } catch (error) {
    console.error('Test failed:', error);
  }
}

testDashboard();