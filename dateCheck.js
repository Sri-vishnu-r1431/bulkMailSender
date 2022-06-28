const date = require('date-and-time');
const mongoose = require('mongoose');
const history = require("./modules/History");
const fsPromises = require('fs/promises');
mongoose.connect("mongodb://localhost/miniProject", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log("Connected to the mongoDb database");
    })
    .catch((err) => {
        console.log("Error conneting to the mongodb Database", err)
    });

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
let clearFiles = async () => {

}