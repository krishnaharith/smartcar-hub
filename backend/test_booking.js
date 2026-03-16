const http = require('http');

const data = JSON.stringify({
  userId: "Guest_123",
  serviceId: "test_service",
  date: "2026-03-20",
  vehicle: "Test Car"
});

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/bookings',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, res => {
  console.log(`statusCode: ${res.statusCode}`);
  res.on('data', d => {
    process.stdout.write(d);
  });
});

req.on('error', error => {
  console.error(error);
});

req.write(data);
req.end();
