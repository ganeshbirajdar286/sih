import jwt from "jsonwebtoken";

export const isLogin = (req, res, next) => {
  try {
    const token = req.cookies?.token;
    if (!token) {
      return res.status(401).json({ message: "Token missing. Login required." });
    }

    const decoded = jwt.verify(token, process.env.PRIVATED_KEY);
    req.user = decoded; 


    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
