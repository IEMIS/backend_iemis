const mongoose = require("mongoose");
const crypto = require('crypto');
const uuidv1 = require('uuid');

const staffSchema = mongoose.Schema({
    staffId:{
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
    title:{
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
    age:Number,
    typeOfstaff:{
        type: String,
        trim: true,
        required: true,
    },
    nationality:{
        type: String,
        trim: true,
        required: true,
    },
    Qualification:{
        type: String,
        trim: true,
        required: true,
    },
    firstappt:{
        type:Date,
        required:true,
    },
    lastPosting:{
        type:Date,
        required:true,
    },
    // this should decrease automaically after a year
    contractYears:{
        type: Number,
        required:year,
    },
   // Date of retirement if not a contract staff and should be generated and determine either by spending 35years or age is 60years  
    retirementyear: Date,
        
    gradeLevel:{
        type: Number,
        required:true,
    },
    designation:{
        type: String,
        trim: true,
        required: true,
    },
    serviceStatus:{
        type: String,
        trim: true,
        required: true,
    },
    subjectSpecialisaion:{
        type: String,
        trim: true,
        required: true,
    },
    subjectTaught:{
        type:Array,
        default: ["Mathematices","English Language","Basic Science", "Social Science","Commercial Study"]
    },
    teachingTypes:{
        type: String,
        trim: true,
        required: true,
    },
    teachingPeriodWK:{
        type: String,
        trim: true,
        required: true,
    },
    //any administrative role Y/N 
    Engagement:{
        type: String,
        trim: true,
        required: true,
    },
    session:{
        type: String,
        trim: true,
        required: true,
    },
    //Date of Last Workshop attended 
    lastWorkshop:{
        type:Date,
        required:true,
    },
        email:{
            type: String,
            trim: true,
            required: true,
        },
        phone:{
            type:Array,
            default:[],
    },
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
staffSchema
    .virtual('password')
    .set(function(password) {
        this._password = password;
        this.salt = uuidv1();
        this.hashed_password = this.encryptPassword(password);
    })
    .get(function() {
        return this._password;
    });

staffSchema.methods = {
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
