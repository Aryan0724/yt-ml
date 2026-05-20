async function test() {
  try {
    const res = await fetch('https://algopilot.integralgroups.in/api/admin/applications', {
      method: 'GET'
    });
    console.log('Status:', res.status);
    const body = await res.json();
    console.log('Applicants:', JSON.stringify(body, null, 2));
  } catch (err) {
    console.error('Error:', err);
  }
}

test();
