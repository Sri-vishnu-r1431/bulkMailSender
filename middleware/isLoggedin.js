const jwt = require("jsonwebtoken");
const ExpressError = require("../utils/ExpressError");
function isLoggedin(req, res, next) {
    let logincookie = req.cookies.user;
    if (typeof (logincookie) === "undefined") {
        throw new ExpressError(401, "Unauthorized");
    }
    else {
        let decoded = jwt.verify(logincookie, "secret");
        req.decoded = decoded[0];
        next();
    }
}
module.exports = isLoggedin;
