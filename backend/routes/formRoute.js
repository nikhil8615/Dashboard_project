import express from "express";
import mysql from "mysql2/promise";
import {
  formSubmit,
  getFormSubmissions,
} from "../controller/formcontroller.js";

const router = express.Router();

router.post("/submit", formSubmit);

router.get("/submissions", getFormSubmissions);

export default router;
