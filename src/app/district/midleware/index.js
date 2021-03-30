const expressJWT = require('express-jwt');
require("dotenv").config();

exports.requiredSignin = expressJWT({
    algorithms:['sha1', 'RS256', 'HS256'],
    secret:process.env.JWT_SECRET,
    requestProperty: 'auth'
})

exports.Auth = (req, res,next) =>{
    const authorised = req.profile && req.auth && req.profile._id == req.auth._id && req.auth.role === "superDistrict"
    console.log(req.auth.role);
    //return res.json({ userIdfromProfile:req.profile._id, usersToken:req.user._id, authorised})
    if(!authorised) return res.status(401).json({error:" you're not authenticated, contact system addministrator "})
    next()
}

exports.isDistrict = (req, res,next) =>{
    const authorised = req.auth && req.auth.role === "superDistrict"
    console.log(req.auth.role);
    //return res.json({ userIdfromProfile:req.profile._id, usersToken:req.user._id, authorised})
    if(!authorised) return res.status(401).json({error:"you're not super District, contact District addministrator"})
    next()
}