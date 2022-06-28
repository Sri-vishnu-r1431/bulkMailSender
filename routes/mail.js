const History = require("../modules/History");
const date = require('date-and-time');
const ExpressError = require("../utils/ExpressError");
const nodemailer = require('nodemailer');
const express = require("express");
const { upload } = require("../helpers/fileHelper");
const isLoggedin = require("../middleware/isLoggedIn");
const app = express.Router();
app.get("/sendMails", isLoggedin, async (req, res) => {
    res.render("sendMails");
});
app.get("/history", isLoggedin, async (req, res) => {
    const history = await History.find();
    res.render("historyMails", { history });
})
app.post("/sendMails", isLoggedin, upload.any(), async (req, res) => {
    try {
        const { emailobject } = req.body;
        const files = req.files;
        console.log(req.decoded.email);
        if (emailobject) {
            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: `${req.decoded.email}`,
                    pass: `${req.decoded.gmailPass}`
                }
            })
            const emailDetails = JSON.parse(emailobject);
            let arr = emailDetails.emailcc.split(" ").join(",");
            const mailsOptions = {

                from: emailDetails.emailFrom,
                cc: arr,
                subject: emailDetails.subject,
                html: emailDetails.body,
                attachments: files

            };
            transporter.sendMail(mailsOptions, async function (err, info) {
                if (err) {
                    throw new ExpressError(500, err);
                } else {
                    console.log('Email Send' + info.response);
                    let recentlySent = new History({
                        Details: arr,
                        time: String(date.format(new Date(), 'YYYY/MM/DD HH:mm:ss'))
                    });
                    await recentlySent.save();
                    res.status(200).send("Sent Email Successfully");
                }
            });


        }

    }
    catch (err) {
        res.send(err).status(400);
    }

})
module.exports = app;