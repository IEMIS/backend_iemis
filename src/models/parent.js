const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema;

const parentSchema = mongoose.Schema({
   familyName:String,
   students:[{
       type:ObjectId,
       ref:"Students"
   }],
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
/**
 * to do
 * =================
 * implement parent login : to manage the students
 */

module.exports = mongoose.model('Parent', parentSchema);