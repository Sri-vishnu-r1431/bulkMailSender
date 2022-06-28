'use strict';
const express = require('express');
const isLoggedin = require('../middleware/isLoggedIn');
const { Student } = require("../modules/Student");
const app = express.Router();
app.get("/viewStudents", isLoggedin, async (req, res) => {
    const Students = await Student.find({});
    let val = req.decoded.isAdmin || false;
    res.render("viewStudents", { Students, isAdmin: val });
})
app.get("/viewStudents/:id/edit", async (req, res) => {
    const { id } = req.params;
    const student = await Student.findById({ _id: id });
    res.render("EditStudent", { student });
});
app.put("/viewStudents/:id", async (req, res) => {
    const id = req.params.id;
    await Student.findByIdAndUpdate(id, { ...req.body.User });
    res.redirect("/viewStudents");
});
app.delete("/viewStudents/:id", async (req, res) => {
    const { id } = req.params;
    await Student.findByIdAndRemove({ _id: id });
    res.redirect("/viewStudents");
})
app.get("/fe", async (req, res) => {
    let { tenth } = req.query;
    let { twelfth } = req.query;
    let { community } = req.query;
    let { Year } = req.query;
    let { Hosteler } = req.query;
    let { feePending } = req.query;
    if (Year === "all") Year = "";
    if (community === "All") {
        community = "OBC BC MBC SC ST OC";
    }
    console.log(Year);
    Year = Year.toString();
    console.log(Year);
    community = community.split(" ");
    console.log(feePending);
    const result = await Student.find({
        tenth: { $gt: (tenth - 1) },
        twelfth: { $gt: (twelfth - 1) },
        userEmail: {
            "$regex": new RegExp("^" + Year)
        },
        community: {
            $in: [...community]
        },
        Hosteler: Hosteler,
        feePending: {
            $gt: feePending - 1
        }

    });
    //console.log(result);
    res.send(result);
})
module.exports = app;