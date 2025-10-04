const jwt = require("jsonwebtoken");
const admin = require("../model/admin");

exports.signedToken = async (payload) => {
  return jwt.sign(payload, process.env.JWT, { expiresIn: "8h" });
};

exports.verifyToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];

  if (!token) return res.send({ status: false, message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT);
    const adminData = await admin.findById({ _id: decoded.id });

    if (!adminData)
      return res.send({ status: false, message: "Session expired" });

    res.locals.admin = adminData._id.toString();
    next();
  } catch(error) {
    console.log('error---', error)
    res.send({ status: false, message: "Failed to authenticate token" });
  }
};