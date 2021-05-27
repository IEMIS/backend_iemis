const mongoose = require("mongoose");
const crypto = require("crypto");
const { v4: uuidv4 } = require('uuid');

const { ObjectId } = mongoose.Schema;
const Schema = mongoose.Schema;

const districtSchema = mongoose.Schema({
    code:{
        type: String,
        trim: true,
        required: true,
    },
    names:{
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
    address: {
        type:String,
        trim:true,
        required:true,
    },
    school:[{
        type:Schema.Types.ObjectId,
        ref:"School"
    }],
    staffs:[{
        type:Schema.Types.ObjectId,
        ref:"Staff"
    }],
    status:{
        type:Boolean,
        default:false,
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
districtSchema
    .virtual('password')
    .set(function(password) {
        this._password = password;
        this.salt = uuidv4();
        this.hashed_password = this.encryptPassword(password);
    })
    .get(function() {
        return this._password;
    });

districtSchema.methods = {
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

module.exports = mongoose.model('District', districtSchema);