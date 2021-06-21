const mongoose = require("mongoose");
const {ObjectId} = mongoose.Schema;

const classSchema = mongoose.Schema({
    classCode:{
        type: String,
        trim: true,
        required: true,
    },
    classTeacher:{
        type: ObjectId,
        ref: "Teacher",
       // required: true,
    },
    AClassTeacher:{
        type: ObjectId,
        ref: "Teacher",
        //required: true,
    },
    names:{
        type:String,
        trim:true,
        required:true,
        unique:true,
    },
});

module.exports = mongoose.model('Classes', classSchema);
