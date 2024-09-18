
// App.js
const express = require('express');

const app = express();
const mysql = require('mysql2/promise');
const sequelize = require('./models');
const User = require('./models/User');

const createDatabase = async () => {
	const connection = await mysql.createConnection({
		host: process.env.DB_HOST || 'BEALYSQL',
		user: process.env.DB_USERNAME || 'root',
		password: process.env.DB_PASSWORD || '!pass',
	});
	await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME || 'BEALY_TT_DB'}\`;`);
};

createDatabase().then(() => {
	app.use(express.json());
	app.get('/', (request, res) => {
		res.send('Hello, World!');
	});

	// =============================================================================
	// -----------------------------------------------------------------------------
	// =============================================================================









	// =============================================================================
	// -----------------------------------------------------------------------------
	// =============================================================================

	sequelize.sync().then(() => {
		app.listen(8080, () => {
			console.log('Server is running on port 3000');
		});
	});
});
