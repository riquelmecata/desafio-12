export const adminValidator = (req, res, next) => {
    console.log('req.user1:', req.user); // Verifica el valor de req.user aquí
    if (req?.user?.adminRole == "admin") return next();
    return res.status(401).json({ error: "Unauthorized, only for admin" });
};

export const userValidator = (req, res, next) => {
    console.log(req.user.role)
    if (req?.user?.adminRole == "user") return next()
    return res.status(401).json({ error: "unathorized only for user" });

}