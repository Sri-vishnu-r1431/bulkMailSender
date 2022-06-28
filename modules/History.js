
const mongoose = require("mongoose");

const historySchema = new mongoose.Schema({
    Details: {
        type: String
    },
    time: {
        type: String
    }
});
const History = mongoose.model("History", historySchema);;
module.exports = History;