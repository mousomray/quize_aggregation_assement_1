const jwt = require('jsonwebtoken'); // For Token
const bcrypt = require('bcryptjs'); // For Password Hashing

// Compare password function
const comparePassword = (password, hashPassword) => {
  return bcrypt.compareSync(password, hashPassword);
};

// Fit token in API header
const Auth = async (req, res, next) => {
  const token = req.body.token || req.query.token || req.headers["x-access-token"];
  if (!token) {
    return res.status(403).send({ message: "A token is required for authentication" });
  }
  try {
    const decoded = jwt.verify(token, process.env.API_KEY);
    req.user = decoded;
    console.log('Decord user...', req.user);
  } catch (err) {
    return res.status(401).send({ messaage: "Invalid Token" });
  }
  return next();
}

module.exports = { comparePassword, Auth };