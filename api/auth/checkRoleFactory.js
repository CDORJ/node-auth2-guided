function checkRoleMiddleware(desiredRole) {
  return function (req, res, next) {
    const realRole = req.decodedToken?.role;
    if (realRole === desiredRole) {
      next();
    } else {
      res.status(403).json({ message: "not authorized" });
    }
  };
}
module.exports = checkRoleMiddleware;
