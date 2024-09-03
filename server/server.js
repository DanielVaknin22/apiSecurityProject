const https = require('https');
const fs = require('fs');
const app = require('./app');
const port = 3000;

const sslOptions = {
  key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.cert'),
};

https.createServer(sslOptions, app).listen(port, () => {
  console.log(`Secure server running at https://localhost:${port}`);
});
