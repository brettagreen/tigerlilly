"use strict";
/**
 * @module /backend/server
 * @requires module:/backend/app
 * @author Brett A. Green <brettalangreen@proton.me>
 * @version 1.0
 * @description imports express app object and sets it to listen on designated port. i.e. hoists the application
 * 
 */

/**
 * express app object
 * @const
 */
const app = require("./app");
const https = require('node:https');
const fs = require('node:fs');

const privateKey = fs.readFileSync( './certs/privkey.pem' );
const certificate = fs.readFileSync( './certs/fullchain.pem' );

const server = https.createServer({
    key: privateKey,
    cert: certificate
}, app).listen(process.env.PORT, function () {
  console.log(`Started on ${process.env.TIGERLILLY_BASE_URL}`);
});

server.keepAliveTimeout = 30 * 1000;
server.headersTimeout = 35 * 1000;
