const express = require('express');
const jwt = require("jsonwebtoken");

const catchAsync = require("../utils/catchAsync");
const { User, validateUser } = require("../modules/User");
const router = express.Router();
const ExpressError = require("../utils/ExpressError");

//SignUp
router.get("/login", catchAsync(async (req, res) => {
    let logincookie = req.cookies.user;
    if (typeof (logincookie) !== "undefined") {
        res.redirect("../viewStudents");
    }
    res.render("Login");
}));
router.get("/register", (req, res, next) => {
    res.render("Register")
});
router.get("/logOut", (req, res, next) => {
    res.clearCookie("user");
    res.redirect("/auth/login");
})
router.post("/register", catchAsync(async (req, res) => {
    const userToReg = req.body.User;
    result = await User.findOne({ 'email': userToReg.email });
    if (result) {
        throw new ExpressError(400, 'Email Already Taken');
    }
    const { error } = validateUser(userToReg);
    if (error) {
        let message = error.details.map(i => i.message).join(",");
        throw new ExpressError(400, message)
    }
    result = await new User(userToReg);
    await result.save();
    if (result.error) {
        let message = result.error.details.map(i => i.message).join(",");
        throw new ExpressError(400, message);
    }
    res.status(200).redirect("../auth/login");

}));
router.post("/login", catchAsync(async (req, res, next) => {
    const userLogin = req.body.User;
    let email = userLogin.email;
    let result = await User.find({ email });
    if (userLogin.password !== result[0].password) {
        throw new ExpressError(401, "Invalid UserMail or password");
    }
    if (!result) {
        throw new ExpressError(401, "Invalid user Name or Password");
    }
    let obj = { ...result };
    const jwttoken = jwt.sign(obj, "secret");
    res.cookie("user", jwttoken);
    res.redirect("../viewStudents");

}));
module.exports = router;
