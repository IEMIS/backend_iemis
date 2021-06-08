const mongoose = require("mongoose");
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
const {ObjectId} = mongoose.Schema;
const Schema = mongoose.Schema;

const studentSchema = mongoose.Schema({
    studentCode:{
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    school:{
        type: Schema.Types.ObjectId,
        ref: "School",
        required: true,
    },
    parent:{
        type: Schema.Types.ObjectId,
        ref: "Parent",
        //required: true,
    },
    exam:{
        type: Schema.Types.ObjectId,
        ref: "Exam",
        //required: true,
    },
    result:{
        type: Schema.Types.ObjectId,
        ref: "Result",
        //required: true,
    },
    class:{
        type: Schema.Types.ObjectId,
        ref: "Class",
        //required: true,
    },
    history:{
        type: Schema.Types.ObjectId,
        ref: "History",
        //required: true,

    },
    /*
    *student code replicate admission numbers
    *
    admissionNo:{
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    */
   
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
    //age to be generated based on dob
   // age:Number,
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
    province:{
        type: String,
        trim: true,
        required: true,
    },
    // address of parent is enough
    /*
    address:{
        type: String,
        trim: true,
        required: true,
    },
    */
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
    stream:{
        type: String,
        trim: true,
        required: true,
    },
    /****
     * HadEce, Please can you explaining the field sir
     */
    HadEce:{
        type: String,
        trim: true,
        required: true,
    },
    subject:{
        type:Array,
        //default: ["Mathematices","English Language","Basic Science", "Social Science","Commercial Study"]
        default: [{
            type:Schema.Types.ObjectId,
            ref:"Subject"
        }]
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
    hashed_password:{
        type: String,
        trim: true,
        required: true,
    },
    salt:String,
});


// virtual field
studentSchema.virtual('names').get(function(){
    //return this.firstName +' ' + this.middleName + ' ' + this.lastName;
    return `${this.firstName} ${this.middleName} ${this.lastName}`;
});

studentSchema
    .virtual('password')
    .set(function(password) {
        this._password = password;
        this.salt = uuidv4();
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

module.exports = mongoose.model('Student', studentSchema);