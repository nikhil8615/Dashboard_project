// import userModel from "../models/userModel.js";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mysql from "mysql2/promise";

// Database connection
const getDbConnection = async () => {
  return await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "#@Ni20051012",
    database: "mysql_db",
  });
};

const createToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

const superAdminLogin = async (req, res) => {
  try {
    const { userID, password } = req.body;
    // Use hardcoded credentials instead of environment variables
    const adminEmail = process.env.ADMIN_EMAIL || "ABC1234";
    const adminPassword = process.env.ADMIN_PASSWORD || "qwerty12345";

    if (userID === adminEmail && password === adminPassword) {
      const jwtSecret = process.env.JWT_SECRET || "your_jwt_secret_key";
      const token = jwt.sign(userID + password, jwtSecret);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid Credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const getWorkerRoles = async (req, res) => {
  try {
    const db = await getDbConnection();
    const [rows] = await db.execute("SELECT DISTINCT Worker_role FROM worker");
    await db.end();

    res.json({
      success: true,
      roles: rows,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const getWorkers = async (req, res) => {
  try {
    const db = await getDbConnection();
    const [rows] = await db.execute("SELECT * FROM worker");
    await db.end();
    res.json({
      success: true,
      workers: rows,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const createRole = async (req, res) => {
  try {
    const { tag, userId, password } = req.body;
    const db = await getDbConnection();

    const [result] = await db.execute(
      "INSERT INTO worker (Worker_role, UserID, User_password) VALUES (?, ?, ?)",
      [tag, userId, password]
    );

    await db.end();

    if (result.affectedRows > 0) {
      res.json({
        success: true,
        message: "Role created successfully",
      });
    } else {
      res.json({
        success: false,
        message: "Failed to create role",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { tag, userId, password } = req.body;
    const db = await getDbConnection();

    const [roleCheck] = await db.execute(
      "SELECT Worker_role FROM worker WHERE Worker_id = ?",
      [id]
    );

    if (
      roleCheck.length > 0 &&
      roleCheck[0].Worker_role.toLowerCase() === "superadmin"
    ) {
      await db.end();
      return res.json({
        success: false,
        message: "Superadmin role cannot be edited",
      });
    }

    const [result] = await db.execute(
      password
        ? "UPDATE worker SET Worker_role = ?, UserID = ?, User_password = ? WHERE Worker_id = ?"
        : "UPDATE worker SET Worker_role = ?, UserID = ? WHERE Worker_id = ?",
      password ? [tag, userId, password, id] : [tag, userId, id]
    );

    await db.end();

    if (result.affectedRows > 0) {
      res.json({
        success: true,
        message: "Role updated successfully",
      });
    } else {
      res.json({
        success: false,
        message: "Failed to update role",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const deleteRole = async (req, res) => {
  try {
    const { id } = req.params;
    const db = await getDbConnection();

    const [roleCheck] = await db.execute(
      "SELECT Worker_role FROM worker WHERE Worker_id = ?",
      [id]
    );

    if (
      roleCheck.length > 0 &&
      roleCheck[0].Worker_role.toLowerCase() === "superadmin"
    ) {
      await db.end();
      return res.json({
        success: false,
        message: "Superadmin role cannot be deleted",
      });
    }

    const [result] = await db.execute(
      "DELETE FROM worker WHERE Worker_id = ?",
      [id]
    );
    await db.end();

    if (result.affectedRows > 0) {
      res.json({
        success: true,
        message: "Role deleted successfully",
      });
    } else {
      res.json({
        success: false,
        message: "Failed to delete role",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { userID, password, role } = req.body;
    const db = await getDbConnection();

    const [users] = await db.execute(
      "SELECT * FROM worker WHERE UserID = ? AND Worker_role = ?",
      [userID, role]
    );
    await db.end();

    if (users.length === 0) {
      return res.json({
        success: false,
        message: "User doesn't exist with this role",
      });
    }

    const user = users[0];

    if (password === user.User_password) {
      const token = jwt.sign(
        {
          userId: user.Worker_id,
          role: user.Worker_role,
          userID: user.UserID,
        },
        process.env.JWT_SECRET || "your_jwt_secret_key",
        { expiresIn: "7d" }
      );

      res.json({
        success: true,
        token,
        user: {
          id: user.Worker_id,
          role: user.Worker_role,
          userID: user.UserID,
        },
      });
    } else {
      return res.json({
        success: false,
        message: "Invalid credentials",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message || "An error occurred during login",
    });
  }
};

export {
  loginUser,
  superAdminLogin,
  getWorkerRoles,
  getWorkers,
  createRole,
  updateRole,
  deleteRole,
};
