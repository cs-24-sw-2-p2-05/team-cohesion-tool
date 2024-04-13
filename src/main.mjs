// INFO:
// This file contains the main logic and routing for the server

// Import and exports (ES6 style)
import express from 'express';
import morgan from 'morgan';
import { routes } from './routing.mjs';
export { app };

const logger = morgan('common');
const app = express();

app.use(logger); // Enable logging of requests.
app.set('trust proxy', 'loopback'); // Trust locally hosted proxies for IP data.

// To see the relevant ports we can use, you can run the following command in an `ssh` session on the server:
// `grep "# HTTP reverse proxy configurations" -A 10 /srv/www/cs-24-sw-2-05.p2datsw.cs.aau.dk/conf-https/mod_proxy.conf`
// This has currently been set to point to /node0/ in that configuration.
const port = 3350;

// Serve static files from the public directory. 
// So that a GET does not have to be create for every file in the public directory.
app.use(express.static('src/public')); 

// Using the routes function from routing.mjs
routes();

// Start the server
app.listen(port, () => {
    console.log(`Web-app listening on: http://localhost:${port}/`);
});
