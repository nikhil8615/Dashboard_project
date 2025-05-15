import jwt from "jsonwebtoken";

const adminAuth = async (req, res, next) => {
  try {
    const { token } = req.headers;
    if (!token) {
      return res.json({
        success: false,
        message: "Not Authorized Login Again",
      });
    }

    const adminEmail = process.env.ADMIN_EMAIL || "ABC1234";
    const adminPassword = process.env.ADMIN_PASSWORD || "qwerty12345";
    const jwtSecret = process.env.JWT_SECRET || "your_jwt_secret_key";

    const token_decode = jwt.verify(token, jwtSecret);
    if (token_decode !== adminEmail + adminPassword) {
      return res.json({
        success: false,
        message: "Not Authorized Login Again",
      });
    }
    next();
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
export default adminAuth;
