const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config/secrets.js");

const router = require("express").Router();

const Users = require("../users/users-model.js");
const checkCredentials = require("./check-payload-middleware");

router.post("/register", checkCredentials, async (req, res, next) => {
  let user = req.body;
  // const rounds = process.env.BCRYPT_ROUNDS || 8; // 2 ^ 8
  const hash = bcrypt.hashSync(user.password, 10);
  user.password = hash;
  try {
    const savedUser = await Users.add(user);
    res.status(201).json(savedUser);
  } catch (err) {
    console.log(err);
    next(err);
  }
});

router.post("/login", checkCredentials, async (req, res, next) => {
  let { username, password } = req.body;
  try {
    const user = await Users.findBy({ username }).first();
    if (user && bcrypt.compareSync(password, user.password)) {
      const token = generateToken(user);
      res.status(200).json({ user, token });
    } else {
      res.status(401).json({ message: "Invalid Credentials" });
    }
  } catch (err) {
    next(err);
  }
});

function generateToken(user) {
  const payload = {
    sub: user.id,
    username: user.username,
    role: user.role,
  };

  const options = {
    expiresIn: "1h",
  };

  const secret = jwtSecret;

  return jwt.sign(payload, secret, options);
}

module.exports = router;
