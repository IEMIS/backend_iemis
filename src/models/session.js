import mongoose from 'mongoose';
const {ObjectId} = mongoose.Schema;

const sessionSchema = mongoose.Schema({
    name:{
        type:String,
        trim:true,
        require:true
    },
    slung:{
        type:String,
        trim:true,
        require:true
    },
})

module.exports = mongoose.Schema('Session',sessionSchema)