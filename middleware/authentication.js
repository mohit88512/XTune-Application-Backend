import jwt from "jsonwebtoken";
import customResponse from "../utilis/customResponse.js";
import dotenv from "dotenv";

// dotenv.config();

export function verifyToken(req, res, next) {
  // Accept token from Authorization header (Bearer <token>) or cookie
  let token = req.cookies?.token;

  // const authHeader = req.headers.authorization;
  // if (authHeader && authHeader.startsWith("Bearer ")) {
  //   token = authHeader.split(" ")[1];
  // }

  if (!token) {
    return customResponse(res, 401, false, "Access Denied. No token provided.", "", "");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded; // { id, email }
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return customResponse(res, 401, false, "Token has expired. Please login again.", "", "");
    }
    return customResponse(res, 401, false, "Invalid token.", "", "");
  }
}