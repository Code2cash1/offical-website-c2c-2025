const fetch = require('node-fetch');

async function testResume() {
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
      // Get applications first
      const appsResponse = await fetch('http://localhost:5000/api/job-applications', {
        headers: {
          'Authorization': `Bearer ${loginData.token}`,
          'Content-Type': 'application/json'
        }
      });

      if (appsResponse.ok) {
        const appsData = await appsResponse.json();
        console.log('Applications found:', appsData.applications.length);
        
        if (appsData.applications.length > 0) {
          const appId = appsData.applications[0]._id;
          console.log('Testing resume for application:', appId);
          
          // Test resume download
          const resumeResponse = await fetch(`http://localhost:5000/api/job-applications/${appId}/resume`, {
            headers: {
              'Authorization': `Bearer ${loginData.token}`
            }
          });

          console.log('Resume download response status:', resumeResponse.status);
          console.log('Resume download headers:', resumeResponse.headers.raw());
          
          // Test resume view
          const viewResponse = await fetch(`http://localhost:5000/api/job-applications/${appId}/resume/view?token=${loginData.token}`);
          console.log('Resume view response status:', viewResponse.status);
          console.log('Resume view headers:', viewResponse.headers.raw());
        }
      }
    }

  } catch (error) {
    console.error('Test failed:', error);
  }
}

testResume();