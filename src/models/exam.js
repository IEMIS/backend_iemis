import mongoose from 'mongoose';
const {ObjectId} = mongoose.Schema;

const examSchema = mongoose.Schema({
    subject:{
        type:ObjectId,
        ref:"Subject",
        require:true
    },
    student:{
        type:ObjectId,
        ref:"Student",
        require:true
    },
    test:Number,
    exam:Number,
    session:{
        type:ObjectId,
        ref:"Session"
    },
    term:String
})

module.exports = mongoose.model('Exam',examSchema)