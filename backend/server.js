import express from "express";
import "dotenv/config";
import cors from "cors";
import userRouter from "./routes/userRoute.js";
import mysql from "mysql2/promise";

//connect to mysql
// const values = [
//   ["Alice", "alice@gmail.com"],
//   ["Bob", "bob@gmail.com"],
//   ["Charlie", "charlie@gmail.com"],
//   ["David", "david@gmail.com"],
//   ["Emma", "emma@gmail.com"],
// ];

const db = await mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "#@Ni20051012",
  database: "mysql_db",
});
console.log("My SQL Connected Successfully");

//we need to create a DB
// await db.execute(`CREATE DATABASE IF NOT EXISTS mysql_db`);
// console.log(await db.execute("SHOW DATABASES"));

// Create worker_roles table if it doesn't exist
await db.execute(`CREATE TABLE IF NOT EXISTS worker_roles(
  id INT AUTO_INCREMENT PRIMARY KEY,
  role_name VARCHAR(100) NOT NULL UNIQUE
)`);
console.log("worker_roles table created or already exists");

// Insert default roles if they don't exist
// await db.execute(`
//   INSERT IGNORE INTO worker_roles(role_name)
//   VALUES
//   ('superadmin'),
//   ('sales'),
//   ('business_development'),
//   ('accounts'),
// `);
await db.execute(
  `INSERT IGNORE INTO worker_roles(role_name) values('developer')`
);
console.log("Default roles inserted or already exist");

// create a table
// await db.execute(`CREATE TABLE IF NOT EXISTS table_name(
//       id INT AUTO_INCREMENT PRIMARY KEY,
//       username VARCHAR(100) NOT NULL,
//       email VARCHAR(100) NOT NULL UNIQUE
//     )`);
// console.log("Table created or already exists");
// await db.query("insert into table_name(username,email) values ?", [values]);
// crud operation
// Insert with INSERT IGNORE to prevent duplicate errors
// await db.execute(`
//       INSERT IGNORE INTO table_name(username, email)
//       VALUES("John", "john@gmail.com")
//     `);
// console.log("Insert operation completed");

// // Read data
const [rows] = await db.execute(`SELECT * FROM table_name`);
console.log("Records in table:", rows);

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());
app.use(cors());

app.use("/api/user", userRouter);

app.get("/", (req, res) => {
  res.send("Hey");
});
app.listen(port, () => console.log("Server Started on PORT: " + port));
