import jwt from "jsonwebtoken";
import mysql from "mysql2/promise";

const getDbConnection = async () => {
  return await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "#@Ni20051012",
    database: "mysql_db",
  });
};

const formSubmit = async (req, res) => {
  let connection;
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: "Name and email are required",
      });
    }

    connection = await getDbConnection();
    const [result] = await connection.execute(
      "INSERT INTO user_submissions (name, email, phone, message) VALUES (?, ?, ?, ?)",
      [name, email, phone || null, message || null]
    );

    res.status(201).json({
      success: true,
      message: "Form submitted successfully",
      data: { id: result.insertId },
    });
  } catch (error) {
    console.error("Error submitting form:", error);
    res.status(500).json({
      success: false,
      message: "Error submitting form",
      error: error.message,
    });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};

const getFormSubmissions = async (req, res) => {
  try {
    const connection = await getDbConnection();
    const [rows] = await connection.execute(
      "SELECT * FROM user_submissions ORDER BY created_at DESC"
    );
    res.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("Error fetching submissions:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching submissions",
      error: error.message,
    });
  }
};

export { formSubmit, getFormSubmissions };
