const multer = require('multer');
const excelToJson = require('convert-excel-to-json');
const { Student, validateStudent } = require("../modules/Student");
const express = require('express');
const isLoggedIn = require("../middleware/isLoggedIn");
const ExpressError = require('../utils/ExpressError');
const app = express.Router();
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/uploads');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

app.get("/multi", isLoggedIn, (req, res) => {
    res.render("upload.ejs");
});
app.get("/single", isLoggedIn, (req, res) => {
    res.render("uploadSingle.ejs");
})
var uploads = multer({ storage: storage });
app.post("/single", async (req, res) => {
    const { error } = validateStudent(req.body.User);
    if (error) {
        let message = error.details.map(i => i.message).join(',');
        throw new ExpressError(400, message);
    }
    else {
        let newStudent = new Student(req.body.User);
        await newStudent.save();
        let Students = await Student.find({});
        res.render("viewStudents", { Students });
    }
})
app.post('/multi', uploads.single("uploadfile"), async (req, res) => {
    let result = excelToJson({
        sourceFile: "public/uploads/" + req.file.filename
    });
    result = result.Sheet1;
    let message = {};
    let title = result[0];
    let finalres = [];
    for (let i = 1; i < result.length; i++) {
        let obj1 = {
            [`${title.A}`]: result[i].A,
            [`${title.B}`]: result[i].B,
            [`${title.C}`]: result[i].C,
            [`${title.D}`]: result[i].D,
            [`${title.E}`]: result[i].E,
            [`${title.F}`]: result[i].F,
            [`${title.G}`]: result[i].G,
            [`${title.H}`]: result[i].H
        }
        finalres.push(obj1);
    }
    let error_cnt = 0;
    let err = [];
    let Students = [];
    for (let i = 0; i < finalres.length; i++) {
        let obj1 = {};
        obj1 = finalres[i];
        const { error } = validateStudent(obj1);
        if (error) {
            err.push(error.details.map(i => i.message).join(","));
            error_cnt++;
        }
        else {
            console.log(obj1);
            let newStudent = await new Student(obj1);
            await newStudent.save();
            Students.push(newStudent);
        }
    }
    res.render("Studentuploads", { Students, error_cnt, err });

});
module.exports = app;
