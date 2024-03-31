const db = require("../db");
const { createToken } = require("../helpers/tokens");

const createTestData = require('./testData')

async function commonBeforeAll() {
	await createTestData();
}

async function commonBeforeEach() {
  	await db.query("BEGIN");
}

async function commonAfterEach() {
  	await db.query("ROLLBACK");

}

async function commonAfterAll() {
  	await db.end();
}

const adminToken = createToken({ id:1, username: "admin_test", isAdmin: true});
const regularToken = createToken({ id: 2, username: "regular_test", isAdmin: false });

module.exports = {
	commonBeforeAll,
	commonBeforeEach,
	commonAfterEach,
	commonAfterAll,
	regularToken,
	adminToken
};