const { createPool } = require('mysql');

const pool = createPool({
  host: "localhost",
  user: "arms2024_admin",
  password: "NfNqrsU9QAkZ",
  database: "arms2024_db",
  connectionLimit: 10,
  port: 3306,
});

// const pool = createPool({
//   host: "localhost",
//   user: "root",
//   password: "root",
//   database: "arms2024_db",
//   connectionLimit: 10,
//   port: 3306,
// });
// const pool = createPool({
//   host: "63.250.52.212",
//   user: "cloudbin_rajesh",
//   password: "Rajesh@2024#",
//   database: "arms",
//   connectionLimit: 10,
//   port: 3306,
// });

pool.getConnection((err, connection) => {
  if (err) {
    console.error("Error connecting to MySQL:", err.message);
    return;
  }

  // Log connection details
  console.log("Connected to MySQL database:");


  // Release the connection to the pool
  connection.release();
});

// Handle unexpected errors
pool.on("error", (err) => {
  console.error("MySQL Pool Error:", err.message);
});
module.exports = pool;