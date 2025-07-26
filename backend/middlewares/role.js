// middlewares/role.js
module.exports = (...roles) => (req, res, next) => {
    // Flatten the roles array in case it's nested
    const flattenedRoles = roles.flat();

    if (!flattenedRoles.includes(req.user.role)) {
        return res.status(403).json({ msg: 'Access denied' });
    }
    next();
};