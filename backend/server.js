"use strict";
/**
 * @module /backend/server
 * @requires module:/backend/app
 * @requires module:/backend/config.PORT
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
/**
 * port app will be listening on
 * @const
 */
const { PORT } = require("./config");

app.listen(PORT, function () {
  console.log(`Started on http://localhost:${PORT}`);
});
