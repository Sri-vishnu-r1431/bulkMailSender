const Joi = require("joi");
const mongoose = require("mongoose");
const studentSchema = new mongoose.Schema({
    userEmail: {
        type: String,
        unique: true,
        required: [true, "A profile must have a emailId"]
    },
    name: {
        type: String,
        required: [true, "A profile must have Name"]
    }
    , community: {
        type: String,
        required: [true, "user must have an community"]
    },
    tenth: {
        type: Number,
        required: [true, "User must provide 10th mark"]
    }
    , twelfth: {
        type: Number,
        required: [true, "User must provide twelfth mark"]
    }
    , standingArrears: {
        type: Number
    },
    Hosteler: {
        type: Boolean,
        required: true
    },
    feePending: {
        type: Number,
        required: true,
    },
    ParentId: {
        type: mongoose.Types.ObjectId,

    }
});
const Student = mongoose.model("Student", studentSchema);
const validateStudent = function (obj) {
    const schema = Joi.object({
        userEmail: Joi.string().email().required(),
        feePending: Joi.number().required(),
        Hosteler: Joi.boolean().truthy('yes').falsy('no').sensitive().required(),
        tenth: Joi.number().min(0).max(100).required(),
        twelfth: Joi.number().min(0).max(100).required(),
        standingArrears: Joi.number().min(0).required(),
        name: Joi.string().required(),
        community: Joi.string().required()
    });
    return schema.validate(obj);
}
module.exports.validateStudent = validateStudent;
module.exports.Student = Student;