const mongoose = require('mongoose')

const parentSchema = mongoose.Schema({
   familyName:String,
    father:[{
        name:String,
        TIN:String,
        address:{
            type: String,
            trim: true,
            required: true,
        },
        occupation:String,
        email:{
            type: String,
            trim: true,
            required: true,
        },
        phone:{
            type:Array,
            default:[],
        }
    }],
    mother:[{
        name:String,
        TIN:String,
        address:{
            type: String,
            trim: true,
            required: true,
        },
        occupation:String,
        email:{
            type: String,
            trim: true,
            required: true,
        },
        phone:{
            type:Array,
            default:[],
        }
    }],
});

module.exports = mongoose.Schema('Parent', parentSchema)