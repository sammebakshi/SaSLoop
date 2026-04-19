const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testSave() {
  const res = await fetch('http://localhost:5000/api/business/setup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer YOUR_TOKEN' // I don't have a token easily
    },
    body: JSON.stringify({
      cgst_percent: 5.5,
      sgst_percent: 5.5,
      gst_included: true,
      name: "Test Biz"
    })
  });
  console.log(await res.json());
}
// Skipping actual run since I don't have a valid JWT token.
