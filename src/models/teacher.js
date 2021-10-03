const mongoose = require("mongoose");
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
const {ObjectId} = mongoose.Schema;
const Schema = mongoose.Schema;

const teacherSchema = mongoose.Schema({
    /*
    teacherCode:{
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    */
    district:{
        type: Schema.Types.ObjectId,
        ref: "District",
        required: true,
    },
    school:{
        type: Schema.Types.ObjectId,
        ref: "School",
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
       // required: true,
    },
    lastName:{
        type: String,
        trim: true,
        required: true,
    },
    title:{
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
        required:true,
    },
    nationality:{
        type: String,
        trim: true,
        required: true,
    },
    qualification:{
        type:Array,
        default:["Mathematices",],
    },
    email:{
        type: String,
        trim: true,
        required: true,
    },
    phone:{
        type: String,
        trim: true,
        //required: true,
    },
    /*
    subjectTaught:{
        type:Array,
        //default: ["Mathematices","English Language","Basic Science", "Social Science","Commercial Study"]
        default: [{
            type:ObjectId,
            ref:"Subject"
        }]
    },
    */
    // classTaking:[{
    //     type:Array,
    //     default:[{
    //         type: Schema.Types.ObjectId,
    //         ref:"Classes"
    //     }]
    // }],
    classTaking:{
        type: Schema.Types.ObjectId,
        ref:"Classes"
    },
    
    subjectSpecialisation:{
        type: String,
        trim: true,
        //required: true,
    },
    level: Number,

 
    //age to be generated based on dob
    //age:Number,
    typeOfstaff:{
        type: String,
        trim: true,
       // required: true,
    },
    firstappt:{
        type:Date,
        ///required:true,
    },
    lastPosting:{
        type:Date,
        //required:true,
    },
    // this should decrease automaically after a year
    contractYears:{
        type: Number,
        //required:true,
    },
   // Date of retirement if not a contract staff and should be generated and determine either by spending 35years or age is 60years  
    retirementyear: Date,
        
    gradeLevel:{
        type: Number,
        //required:true,
    },
    designation:{
        type: String,
        trim: true,
        //required: true,
    },
    serviceStatus:{
        type: String,
        trim: true,
        //required: true,
    },
    
    teachingTypes:{
        type: String,
        trim: true,
       // required: true,
    },
    teachingPeriodWK:{
        type: String,
        trim: true,
        //required: true,
    },
    //any administrative role Y/N 
    Engagement:{
        type:String,
        trim: true,
        //required: true,
    },
    session:{
        type: String,
        trim: true,
        //required: true,
    },
    //Date of Last Workshop attended, it should be an array or subdocument
    lastWorkshop:{
        type:Date,
        //required:true,
    },

    created:Date,
    updated_at:Date,
    salt:String,
    hashed_password:{
        type: String,
        trim: true,
        //required: true,
    },
    resetToken:String,
});


// virtual field
teacherSchema.virtual('names').get(()=>{
    return `${firstName} ${lastName} ${middleName}`
})

teacherSchema
    .virtual('password')
    .set(function(password) {
        this._password = password;
        this.salt = uuidv4();
        this.hashed_password = this.encryptPassword(password);
    })
    .get(function() {
        return this._password;
    });

teacherSchema.methods = {
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

module.exports = mongoose.model('Teacher', teacherSchema)
