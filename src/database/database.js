require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });
const { QuickDB, MySQLDriver } = require("quick.db");

const dbConfig = {
	host: process.env.DATABASE_HOST,
	user: process.env.DATABASE_USER,
	password: process.env.DATABASE_PASSWORD,
	database: process.env.DATABASE_DATABASE,
	port: process.env.DATABASE_PORT,
	multipleStatements: true,
	dateStrings: true,
	connectionLimit: 10
};

const initializeDB = async () => {
	const mysqlDriver = new MySQLDriver(dbConfig);
	await mysqlDriver.connect();
	return new QuickDB({ driver: mysqlDriver });
};

module.exports = initializeDB;

/*

* Sample case usage

const initializeDB = require('./path-to-your-db-file');

(async () => {
	try {

	*Initialize the database connection

	const db = await initializeDB();
	    
		* Use quick.db as needed
		await db.set("userInfo", { difficulty: "Easy" });
		const userInfo = await db.get("userInfo");
		console.log(userInfo); // -> { difficulty: 'Easy' }
	    
		* Your other code here
	} catch (error) {
		console.error("Database initialization error:", error);
	}
})();
*/