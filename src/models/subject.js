import mongoose from 'mongoose';
const {ObjectId} = mongoose.Schema;

const subjectSchema = mongoose.Schema({
    subject_code:{
        type:String,
        require:true,
        unique:true,
    },
    name:String,
    studentTaking:{
        type:Array,
        default:[{
            type:ObjectId,
            ref:"Student"
        }]
    },
    teacherTaking:{
        type:Array,
        default:[{
            type:ObjectId,
            ref:"Teacher",
        }]
    }
})

module.exports = mongoose.model("Subject", subjectSchema);
