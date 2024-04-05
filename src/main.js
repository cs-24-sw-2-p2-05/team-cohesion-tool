// This is the example "Hello World" from:
// https://expressjs.com/en/starter/hello-world.html
const express = require('express');
const morgan = require('morgan');

const logger = morgan('common');
const app = express();

app.use(logger); // Enable logging of requests.
app.set('trust proxy', 'loopback'); // Trust locally hosted proxies for IP data.

app.use(express.static('src/public')); // Serve static files from the public directory.

// To see the relevant ports we can use, you can run the following command in an `ssh` session on the server:
// `grep "# HTTP reverse proxy configurations" -A 10 /srv/www/cs-24-sw-2-05.p2datsw.cs.aau.dk/conf-https/mod_proxy.conf`
// This has currently been set to point to /node0/ in that configuration.
const port = 3350;

app.get('/', (req, res) => {
  console.log('./public/html/index.html', { root: __dirname });
  res.sendFile('./public/html/index.html', { root: __dirname });
});

app.listen(port, () => {
  console.log(`Example app listening on: http://localhost:${port}/`);
});
