import * as models from  "../../../models";
import _ from 'loadash';

 export const create = async (req, res) =>{
     const  {code, names, email, district, contact, eduLevel, schoolType,ownership,estabYear  }= req.body 
     const isSchool = await new models.School.findOne({email})
     if(isSchool){
         /***
          * 
          */
        res.status(400).json({"error":"School email already exist"})
     }
     const school = new models.School.create({code, names, email, district, contact,eduLevel,schoolType, ownership, estabYear })
     school.save((err, scho)=>{
         if(err || !scho){
             /**
              * 
              */
             res.status(405).json({"error":"error in creating a school"})
         }

         res.status(200).json({"message":"school is created", school:scho})
     })
 }

 export const schools = async(req, res) =>{
     models.School.find().populate({
         path:'district', select:'names', options: {limit:5}
        }).exec((err, school)=>{
         if(err || school){
             /**
              * 
              */

              res.status(404).json({"error":"schools are not available"})
         }

         /***
          * 
          */
         res.status(200).json({"message":"successful", "schools":school})
     })
 }

 export const schoolById = async (req, res, next, id) =>{
    models.School.findById(id).populate('district').exec((err, school)=>{
        if(err || !school){
            /**
             * 
             */
            res.status(404).json({"error":"school not found"})
        }

        req.school = school;
        next();
    });
 }

 export const updateSchool = async (req, res)=>{

 }

 export const deleteSchool = async (req, res)=>{

 }

 export const schoolByDistrict = async (req, res, next, id)=>{
     //models.District.findById(id).exec((err, district)=>{
        models.District.findById(id)
        .populate('school')
        .sort({ district: -1, school:-1 })
        .exec((err, district)=>{
         if(err || !district){
             /**
              * 
              */
             res.status(404).json({"error":"District not exist"})
         }
         req.schoolByDistrict = district;
         next()
     })
 }

 export const studentInSchool = async (req, res )=>{
     const school = req.school;
  
     school.populate('student').exec((err, student)=>{
         if(err || !student){
             /**
              * 
              */
             return res.status(400).json({"error":"fail", err})
         }

         res.status(200).json({"message":"succesfull", student})
     })
 }