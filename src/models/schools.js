const mongoose = require("mongoose");
const crypto = require("crypto");
const { v4: uuidv4 } = require('uuid');

const { ObjectId } = mongoose.Schema;

const schoolSchema = mongoose.Schema({
    code:{
        type:String,
        trim:true,
        required:true,
        unique:true,
    },
    district:{
        type: ObjectId,
        ref: "District",
        required: true,
    },
    student:{
        type: ObjectId,
        ref: "Student",
    },
    names:{
        type:String,
        trim:true,
        required:true,
    },
    email:{
        type:String,
        trim:true,
        required:true,
        unique:true,
    },
    contact: [{
        fax:{
            type:String,
            trim:true,
            required:false,
            unique:true,
        },
        mailBox:{
            type:String,
            trim:true,
            required:true,
        },
        phone:{
            type:String,
            trim:true,
            required:true,
            unique:true,
        },
        province:{
            type: String,
            trim: true,
            required: true,
        },
    }],
    
    //ECE, Primary, Secondary, Technical Educ
    /**
     * to do 
     * =============
     * Move Edu level variable type to an array for simplicity validations, 
     * however, String can work well and validated by the front end
     */
    eduLevel:{
        type: String,
        trim: true,
        required: true,
    },
    //govt, community, faith-based, private
    ownership:{
        type:String,
        trim:true,
        required:true,
    },
    //Year of Establishment
    estabYear:{
        type:Date,
        required:true,
    },
    
    //Regular or Special
    schoolCat:{
        type:String,
        trim:true,
        required:true,
    },
 
    //boarding or day
    schoolType:{
        type:String,
        trim:true,
        required:true,
    },
    
    //school head staff ID
    headID:{
        type:ObjectId,
        ref:"Teacher",
    },
    //Date of Last Inspection to School
    lastInspection:[{
        specific:Date,
        byWhom:String,
        by:{
            type:ObjectId,
            ref:"Staff"
        },
        observation:[{
            type: String,
            trim: true,
            required: true,
        }]
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
        this.salt = uuidv4();
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

module.exports = mongoose.model('School', schoolSchema)