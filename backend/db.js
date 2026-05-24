const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "sarakway-database.cnywtutq8hur.us-east-1.rds.amazonaws.com",
  user: "admin",
  password: "sarakwayadmin",
  database: "SarakWay_Database",
});

// ONLY connect if we are NOT in a test environment
if (process.env.NODE_ENV !== "test") {
  db.connect((err) => {
    if (err) {
      console.error(
        "Database connection failed:",
        err
      );
    } else {
      console.log(
        "Connected to RDS MySQL"
      );
    }
  });
}

module.exports = db;
