const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const authenticate = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.redirect("/login");

  try {
    const decoded = jwt.verify(token, "Ambikesh@1234");
    req.user = decoded;
    next();
  } catch (err) {
    res.clearCookie("token");
    res.redirect("/login");
  }
};

const authorizeAdmin = (req, res, next) => {
  if (req.user.role !== "admin") return res.status(403).send("Access Denied");
  next();
};


module.exports = { authenticate,authorizeAdmin };
