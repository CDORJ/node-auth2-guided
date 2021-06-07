const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  // add code here to verify users are logged in
  const token = req.headers.authorization;

  if (!token) {
    res.status(401).json({ message: "Valid token required" });
  } else {
    //check the token
    jwt.verify(token, "keepitsecret", (err, decoded) => {
      if (err) {
        res
          .status(401)
          .json({ message: `Invalid token. Error: ${err.message}` });
      } else {
        req.decodedToken = decoded;
        next();
      }
    });
  }
};
