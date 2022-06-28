const express = require('express');
const path = require('path');
const ExpressError = require("./utils/ExpressError");
const methodOverride = require("method-override");
const ejsMate = require('ejs-mate');
const cors = require('cors');
const app = express();
const cookieParser = require("cookie-parser");
const config = require("./helpers/config");
const multer = require('multer');
const mongoose = require('mongoose');
const history = require("./modules/History");
//mongodb Database connectivity
mongoose.connect("mongodb://localhost/miniProject", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log("Connected to the mongoDb database");
    })
    .catch((err) => {
        console.log("Error conneting to the mongodb Database", err)
    })
async function checkHistoryToClear() {
    let res = await history.find({});
    await history.deleteMany({});
    let curr = date.format(new Date(), 'YYYY/MM/DD HH:mm:ss')
    let obj = [];
    for (let i of res) {
        let s = i.time.split(" ");
        let diff = Math.abs(new Date(s) - new Date(curr));
        let diffDays = Math.ceil(diff / (1000 * 60 * 60 * 24));
        if (diffDays <= 29) {
            obj.push(i);
        }


    }
    for (let j of obj) {
        let his = new history(j);
        await his.save();
    }
}
setInterval(checkHistoryToClear, 86400000);//running function for each day so the value
//requiring routes
const auth = require("./routes/auth");
const uploads = require("./routes/upload");
const mail = require("./routes/mail");
const viewStudents = require("./routes/viewStudents");

// app.use
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'))
app.engine('ejs', ejsMate);
app.use(cors());
app.set('view engine', 'ejs');
app.use(express.static('public'))
app.set("views", path.join(__dirname, "views"));


//routes
app.use("/upload", uploads);
app.use("/", viewStudents);
app.use("/auth", auth);
app.use("/mail", mail);

//listening
app.get("/", (req, res) => {
    res.send("Welcome to Miniproject");
});
app.all("*", (req, res, next) => {
    next(new ExpressError(404, 'Page not Found'));
});
app.use((err, req, res, next) => {

    const { statusCode = 500, message = 'Something went Wrong!!!' } = err;
    res.status(statusCode).render('error', { err });
});
const PORT = config.PORT || 3000;
app.listen(PORT, () => {
    console.log("listening on port", PORT);
});
