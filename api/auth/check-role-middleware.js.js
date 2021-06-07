module.exports = (role) => (req, res, next) => {
  if (req.decodedToken.role === role) {
    next();
  } else {
    res.status(403).json({
      message: `You must be an adminstrator do to access that information.`,
    });
  }
};
