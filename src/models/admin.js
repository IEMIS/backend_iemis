const mongoose = require("mongoose");
const crypto = require("crypto");
const { v4: uuidv4 } = require('uuid');

const adminSchema = mongoose.Schema({
    firstName:{
        type: String,
        trim: true,
        required: true,
    },
    middleName:{
        type: String,
        trim: true,
        required: true,
    },
    lastName:{
        type: String,
        trim: true,
        required: true,
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
    level:{
        type:Number,
        default:1,
    },
    designation:{
        type: String,
        trim: true,
    },
    created:Date,
    salt:String,
    hashed_password:{
        type: String,
        trim: true,
        required: true,
    },
    resetToken:String,
},
{ timestamps: true }
);

// virtual field
adminSchema
    .virtual('password')
    .set(function(password) {
        this._password = password;
        this.salt = uuidv4();
        this.hashed_password = this.encryptPassword(password);
    })
    .get(function() {
        return this._password;
    });

adminSchema.methods = {
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

module.exports = mongoose.model('Admin', adminSchema);
