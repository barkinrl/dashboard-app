import jwt from "jsonwebtoken";

// Authenticate user using JWT token
export const authenticate = (req, res, next) => {
  const token = req.cookies.token;
  if (!token)
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified.user; // Attach user info to the request object
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid token." });
  }
};

// Authorize user based on roles
export const authorize = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res
      .status(403)
      .json({
        message:
          "Forbidden. You do not have permission to perform this action.",
      });
  }
  next();
};
