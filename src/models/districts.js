const mongoose = require("mongoose");
const crypto = require("crypto");
const { v4: uuidv4 } = require('uuid');

const { ObjectId } = mongoose.Schema;
const Schema = mongoose.Schema;

const districtSchema = mongoose.Schema({
    code:{
        type: String,
        trim: true,
        //required: true,
      
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
    staffs:[{
        type:Schema.Types.ObjectId,
        ref:"Staff"
    }],
    status:{
        type:String,
        trim:true,
        //required:true
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

districtSchema.virtual('password').set(function(password) {
        this._password = password;
        this.salt = uuidv4();
        this.hashed_password = this.encryptPassword(password);
    })
.get(function() {
    return this._password;
});

//districtSchema.virtual('code').set(function(){}).get(function(){return })

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
    },

    /*
    distCode: (()=>{
        //if(!this.code) return ''
        try {
            let dCode = 'D0007'; //this.code = this.code + 1
            console.log({dCode, code})
            return dCode ;
        } catch (er) { 
            console.log("error")
            return 
        }
    }),
    increaseCode: function(){
        if(!this.code) return ''
        try {
            let dCode = this.code = this.code + 1
            console.log({dCode, code})
            return dCode ;
        } catch (e) { return console.log({e})}
    }
    */
};

module.exports = mongoose.model('District', districtSchema);