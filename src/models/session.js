import mongoose from 'mongoose';

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

module.exports = mongoose.model('Session',sessionSchema)