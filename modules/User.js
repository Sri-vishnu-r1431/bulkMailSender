const mongoose = require('mongoose');
const Joi = require('joi');
const Schema = mongoose.Schema;
const userSchema = new Schema({
    userName: {
        type: String,
        required: true,
        validate: {
            validator: function (obj) {
                return obj.length >= 0 && obj.length <= 20
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    email: {
        type: String,
        required: true,
        minlength: 7
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    gmailPass: {
        type: String,
        required: true
    }
});
const User = mongoose.model("User", userSchema);
function validateUser(obj) {
    const schema = Joi.object({
        userName: Joi.string().min(0).max(20).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(8).required(),
        gmailPass: Joi.string().required()
    });
    return schema.validate(obj);
}
module.exports.User = User;
module.exports.validateUser = validateUser;
