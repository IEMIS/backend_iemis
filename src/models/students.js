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
    cohortA:{
        type: String,
        trim: true,
        //required: true,
    },
      /*
    parent:{
        type: Schema.Types.ObjectId,
        ref: "Parent",
    },
    */
    /*
    exam:{
        type: Schema.Types.ObjectId,
        ref: "Exam",
    },
    result:{
        type: Schema.Types.ObjectId,
        ref: "Result",
    },
    history:{
        type: Schema.Types.ObjectId,
        ref: "History",
        //required: true,
    },
    */
    school:{
        type: Schema.Types.ObjectId,
        ref: "School",
        required: true,
    },
    //=========add this field to ease generation of indicators from education level=====
     /*
    eduLevel:{
       type: String,
        trim: true,
        required: true,
    },
    */
    presentClass:{
        type: Schema.Types.ObjectId,
        ref: "Classes",
        required: true,
    },
    age:{
        type:Number
    },
    edulevel:{
        type:String,
        trim: true,
    },
    district:{
        type: Schema.Types.ObjectId,
        trim: true,
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
        //required: true,
    },
    lastName:{
        type: String,
        trim: true,
        required: true,
    },
    religion:{
        type: String,
        trim: true,
        //required: true,
    },
    gender:{
        type: String,
        trim: true,
        required: true,
    },
    dob:{
        type:Date,
        //required:true,
    },
    //age to be generated based on dob
   // age:Number,
    country:{
        type: String,
        trim: true,
        //required: true,
    },
    ethnicity:{
        type: String,
        trim: true,
       // required: true,
    },
    province:{
        type: String,
        trim: true,
        //required: true,
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
        type: String,
        trim: true,
    },
    stream:{
        type: String,
        trim: true,
    },
    
    HadEce:{
        type: String,
        trim: true,
        //required: true,
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
        type: Schema.Types.ObjectId,
        trim: true,
        required: true,
    },
    created:Date,
    salt:String,
    hashed_password:{
        type: String,
        trim: true,
        //required: true,
    },
    resetToken:String,
},
{ timestamps: true }
);


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