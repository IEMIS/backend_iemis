const mongoose = require('mongoose');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
const {ObjectId} = mongoose.Schema;

const staffSchema = mongoose.Schema({
    staffCode:{
        unique:true,
        type:String,
        trime:true,
        require:true,
    },
    district:{
        type: ObjectId,
        ref: "District",
        required: true,
    },
    role:{
        type: Array, 
        default: [""]
    },
    firstName:{
        type: String,
        trim: true,
        required: true,
    },
    middleName:{
        type: String,
        trim: true,
        //required: false,
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
    designation:{
        type: String,
        trim: true,
        required: true,
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
    
    //level: Number,
    created:Date,
    salt:String,
    hashed_password:{
        type: String,
        trim: true,
        required: true,
    },
},
{ timestamps: true }
);

staffSchema
.virtual('password')
/*.set(password=>{
    this.password = password;
    this.salt = uuidv4();
    this.hashed_password = this.encryptPassword(password)
})
.get(()=>{
    return this.password;
});*/
.set(function(password) {
    this._password = password;
    this.salt = uuidv4();
    this.hashed_password = this.encryptPassword(password);
})
.get(function() {
    return this._password;
});

staffSchema.methods = {
   /* authenticate: plainText =>{
        return this.encryptPassword(plainText) === this.hashed_password;
    },
    encryptPassword: password =>{
        if(!password) return '';
        try {
            return crypto.createHmac('sha1', this.salt).update(password).digest('hex')
        } catch (error) {
            console.log({error})
            return ''
        }
    }
}; */
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

module.exports = mongoose.model('Staff', staffSchema)