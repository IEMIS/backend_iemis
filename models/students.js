const mongoose = require("mongoose");
const crypto = require('crypto');
const uuidv1 = require('uuid/v1');

const studentSchema = mongoose.Schema({
    studentId:{
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    schoolCode:{
        type: String,
        trim: true,
        required: true,
    },
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
    religion:{
        type: String,
        trim: true,
        required: true,
    },
    gender:{
        type: String,
        trim: true,
        required: true,
    },
    dob:{
        type:Date,
        required:true,
    },
    country:{
        type: String,
        trim: true,
        required: true,
    },
    ethnicity:{
        type: String,
        trim: true,
        required: true,
    },
    providence:{
        type: String,
        trim: true,
        required: true,
    },
    address:{
        type: String,
        trim: true,
        required: true,
    },
    disability:{
        type: Array,
        default:[],
    },
    yearAdmission:{
        type:Date,
    },
    presentClass:{
        type: String,
        trim: true,
        required: true,
    },
    HadEce:{
        type: String,
        trim: true,
        required: true,
    },
    subject:{
        type:Array,
        default: ["Mathematices","English Language","Basic Science", "Social Science","Commercial Study"]
    },
    status:{
        type: String,
        trim: true,
        required: true,
    },
    session:{
        type: String,
        trim: true,
        required: true,
    },
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
    hashed_password:{
        type: String,
        trim: true,
        required: true,
    },
    salt:String,
});


// virtual field
studentSchema
    .virtual('password')
    .set(function(password) {
        this._password = password;
        this.salt = uuidv1();
        this.hashed_password = this.encryptPassword(password);
    })
    .get(function() {
        return this._password;
    });

studentSchema.methods = {
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

module.exports = mongoose.model('student', studentSchema);