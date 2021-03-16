const mongoose = require("mongoose");
const crypto = require("crypto");
const uuid = require("uuid/v1");

const schoolSchema = mongoose.Schema({
    code:{
        type:String,
        trim:true,
        required:true,
        unique:true,
    },
    name:{
        type:String,
        trim:true,
        required:true,
    },
    //ECE, Primary, Secondary, Technical Educ
    eduLevel:{
        type: String,
        trim: true,
        required: true,
    },
    province:{
        type: String,
        trim: true,
        required: true,
    },
    district:{
        type: String,
        trim: true,
        required: true,
    },
    mailBox:{
        type:String,
        trim:true,
        required:true,
    },
    //Year of Establishment
    estabYear:{
        type:Date,
        required:true,
    },
    email:{
        type:String,
        trim:true,
        required:true,
        unique:true,
    },
    phone:{
        type:String,
        trim:true,
        required:true,
        unique:true,
    },
    fax:{
        type:String,
        trim:true,
        required:false,
        unique:true,
    },
    district:{
        type:String,
        trim:true,
        required:true,
    },
    //govt, community, faith-based, private
    ownership:{
        type:String,
        trim:true,
        required:true,
    },
    //Regular or Special
    schoolCat:{
        type:String,
        trim:true,
        required:true,
    },
    //boarding or day
    schoolTpe:{
        type:String,
        trim:true,
        required:true,
    },
    //school head staff ID
    headID:{
        type:String,
        trim:true,
        required:true,
    },
    //Date of Last Inspection to School
    lastInspection:[{
            specific:Date,
            byWhom:String,
            observation:{
                type: String,
                trim: true,
                required: true,
            }
    }],
            created:Date,
            updated_at:Date,
            salt:String,
            hashed_password:{
                type: String,
                trim: true,
                required: true,
            },
        });
        

// virtual field
schoolSchema
    .virtual('password')
    .set(function(password) {
        this._password = password;
        this.salt = uuidv1();
        this.hashed_password = this.encryptPassword(password);
    })
    .get(function() {
        return this._password;
    });

schoolSchema.methods = {
    authenticate: function(plainText) {
        return this.encryptPassword(plainText) === this.hashed_password;
    },

    encryptPassword: function(password) {
        if (!password) return '';
        try {
            return crypto
                .createHmac('sha1', this.salt)
                .update(password)
                .digest('hex');
        } catch (err) {
            return '';
        }
    }
};
