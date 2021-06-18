const District = require("../../../models/district");
import _ from 'lodash';
import * as models from '../../../models'


exports.create = async (req, res) =>{
    const {email} = req.body;
    /* 
        #swagger.tags = ['Admin services']
        #swagger.description = 'Endpoint allow to create admin user' 
     
        #swagger.parameters['obj'] = {
        in: 'body',
        description: 'create a new admin',
        required: true,
        type: 'object',
        schema: {
                    "email": "admin@gmail.com",
                    "password": "password_demo_123",
                    "firstName" : "ade",
                    "lastName" : "lastName",
                    "middleName" : "ola",
                }
       } 
    */
   const isAdmin = await  models.Admin.findOne({email});
   if(isAdmin){
        /* #swagger.responses[400] = {
                description: "admin available",
                schema: { 
                    "error ":"admin already on system, can also signin",
                 }
            } 
        */
       return res.status(400).json({error:"admin already on system, can also signin"})
    }  
    const admin = new models.Admin (req.body);
    admin.save((err, data)=>{
        //console.log({err, data})
        if(err || !data){

            /* #swagger.responses[401] = {
                description: "error in creating admin",
                schema: { 
                    "error ":"error in creating admin",
                 }
            } 
            */
            return res.status(401).json({error:"error in creating admin, please try again",err})
        }

            /* #swagger.responses[200] = {
                description: "admin succesfully created",
                schema: { 
                    "message ":"admin succesfully created",
                    "data":{
                        "_id":"002whhe",
                        "firstName":"adem",
                        "lastName":"Oluyemi",
                        "email":"adin@gmail.com"
                    }
                 }
            } 
            */
        res.status(200).json({message:"admin successfully created, you can now login", data})
    }) 
}

exports.adminById= async (req, res, next, id)=>{
    models.Admin.findById(id).exec((err, admin)=>{
        //console.log({admin, err})
        if(err || !admin){
            /**
             * docs
             */
            return res.status(404).json({error:"admin not found", err});
        }
        req.admin = admin;
        next();
    })
}

exports.update = async (req, res)=>{

    let admin = _.extend(req.admin, req.body)
    admin.update_at = Date.now();
    admin.save((err, data)=>{
        //console.log({err, data})
        if(err){
            /**
             * 
            */
           return res.status(403).json({error:"fails to update admin", err})
        }
        /**
         * docs
         */
        res.status(200).json({message:"admin update successful", data})
    })
}

exports.delete = async (req, res)=>{
    let admin = req.admin;
    admin.remove((err, data)=>{
        if(err || !data){
            /**
             * 
             */
            res.status(403).json({error:"fails to delete admin", err})
        }
        /**
         * docs
         */
        res.status(200).json({message:"admin succesfully deleted", data})
    })
}

exports.admin = async (req, res) =>{
    req.admin.salt= undefined
    req.admin.resetToken = undefined
    req.admin.hashed_password = undefined
    res.status(200).json({message:"admin successfully fetched", data:req.admin})
}

exports.admins = async (req, res) =>{
    const admins =await models.Admin.find();
    if(!admins){
        /**
         * docs not get any admin
         */
        return res.status(404).json({error:"admin not founds"})
    }
    res.status(200).json({message:"admin successfully fetched", data:admins})
}

exports.countAdmin= async (req, res)=>{
    models.Admin.countDocuments().exec((err, result)=>{
        if(err || !result){
            /**
             * docs for not count
             */
            return res.status(404).json({error:"fails to count documents", err})
        }
        res.status(200).json({message:"admin successfully count", data:result})
    });

    /*
    const count =await  models.Admin.aggregate(_id).exec((err, result)=>{

        if(err || !result){
            /**
             * docs for not count
             *
            return res.status(404).json({error:"fails to count documents", err})
        }
        res.status(200).json({message:"admin successfully count", data:result})
    })
    */
}


/***
 * District services for Admin 
 */

 exports.createDistric = async (req, res)=>{
    const {email} = req.body;
    /* 
      #swagger.tags = ['Admin services']
      #swagger.description = 'Endpoint to create a new district' 
  
        #swagger.parameters['obj'] = {
        in: 'body',
        description: 'create a new admin',
        required: true,
        type: 'object',
        schema: {
                    "email": "admin@gmail.com",
                    "password": "password",
                    "name" : "ade",
                    "phone" : "09045677",
                }
       } 
    */
   const isDistrict = await  models.District.findOne({email});
   if(isDistrict){
        /* #swagger.responses[400] = {
                description: "district already created",
                schema: { 
                    "error ":"District already created",
                 }
            } 
        */
       return res.status(400).json({error:"District already created"})
    }  
    const district = new models.District(req.body);
    district.save((err, data)=>{
        //console.log({err, data})
        if(err || !data){

            /* 
               #swagger.responses[401] = {
                description: "error in creating district",
                schema: { 
                    "error ":"error in creating district",
                }
            } 
            */
            return res.status(401).json({error:"error in creating district, please try again",err})
        }

            /* #swagger.responses[200] = {
                description: "district succesfully created",
                schema: { 
                    "message ":"district succesfully created",
                    "data":{
                        "_id":"002whhe",
                        "firstName":"adem",
                        "lastName":"Oluyemi",
                        "email":"adin@gmail.com"
                    }
                 }
            } 
            */
        res.status(200).json({message:"District successfully created", data})
    })
}

exports.districts = async (req, res)=>{
    /* 
    *
    */
    models.District.find((err, data)=>{
       if(err || !data){
           /* #swagger.responses[404] = {
                description: "Find all the district",
                schema: { 
                    "error ":"Disrict is not available",
                }
            } 
            */
           return res.status(404).json({error:"District is not available",err})
        }
        /*
            #swagger.responses[200] = {
                description: "All district list",
                schema: { 
                    "mesage":"Disrict is successfully fetched",
                    "data":[
                        {
                        "_id":"88888888888888",
                        "name":"ggaga",
                        "phone":"090888",
                        "email":"ass@dd.vb"
                        },
                        {
                        "_id":"88888888888888",
                        "name":"ggaga",
                        "phone":"090888",
                        "email":"ass@dd.vb"
                        },
                    ]
                }
            } 
        */
       return res.status(200).json({"message":"District is successfully fetched",data})
    })
}

exports.districtById= async (req, res, next,id)=>{
    // #swagger.start
    /* 
      #swagger.tags = ['Admin services']
      #swagger.description = 'Endpoint to create a new district' 
      #swagger.parameters['districtById'] = { description: "District  ID" } 
    */
    models.District.findById(id).exec((err, dist)=>{
        if(err || !dist){ 
            /* #swagger.responses[401] = {
                description: "District not found",
                schema: { 
                    "error ":"District not found",
                }
            } 
            */
            return res.status(404).json({error: "District not found"})
        }
        req.district = dist;
        next()
    })
    // #swagger.start
}

exports.district = async (req, res)=>{
    // #swagger.start

    /* 
       #swagger.tags = ['Admin services']
       #swagger.description = 'Endpoint to create a new district'  

        #swagger.responses[200] = {
            description: "district succesfully fetched",
            schema: { 
                "message ":"district succesfully fetched",
                "data":{
                    "_id":"002whhe",
                    "firstName":"adem",
                    "lastName":"Oluyemi",
                    "email":"adin@gmail.com"
                }
            }
        } 
    */
    res.status(200).json({message:"district succesfully fetched", data:req.district})
}

exports.updateDistrict = async (req, res) => {
    /* 
      #swagger.tags = ['Admin services']
      #swagger.description = 'Endpoint to create a new district' 
    */
    let district = req.district
    district = _.extend(district,req.body);
    district.update_at = Date.now();
    district.save((err,data)=>{
        if(err ||!data) {
          /* #swagger.responses[401] = {
                description: "error in update district",
                schema: { 
                    "error ":"error in update district",
                }
            } 
            */
            return res.json({error: "error in updating district"})
        }

        /* 
            #swagger.responses[200] = {
                description: "district succesfully updated",
                schema: { 
                    "message ":"district succesfully updated",
                    "data":{
                        "_id":"002whhe",
                        "firstName":"adem",
                        "lastName":"Oluyemi",
                        "email":"adin@gmail.com"
                    }
                 }
            } 
        */
        res.json({data,message:"district succesfully updated"})
    })
};


exports.deleteDistrict = async (req, res) => {
    /* 
      #swagger.tags = ['Admin services']
      #swagger.description = 'Endpoint to create a new district' 
    */
    const district = req.district
    district.remove((err, data)=>{
        if(err){
             /* #swagger.responses[400] = {
                description: "Error in deleting district",
                schema: { 
                    "error ":"Error in deleting district",
                }
            } 
            */
            return res.status(400).json({error:"Error in deleting district"});
        }
         /* 
            #swagger.responses[200] = {
                description: "district successfully deleted",
                schema: { 
                    "message ":"district successfully deleted",
                    "data":{
                        "_id":"002whhe",
                        "firstName":"adem",
                        "lastName":"Oluyemi",
                        "email":"adin@gmail.com"
                    }
                 }
            } 
        */
        return res.json({message:"district successfully deleted", data})
    })
};

exports.countDistrict = async (req, res)=>{
    models.District.countDocuments().exec((err, data)=>{
        /**
         * docs
         */
        if(err || !data){
            /**
             * docs
             */
            return res.status(404).json({error:"error to count document", err})
        }
        /**
         * docs
         */
        res.status(200).json({message:"District successfully counted", data})
    })
}

/**
 * Admin School services 
 */

/**
 * create a new school
 * @param {*} req 
 * @param {*} res 
 */
 export const createSchool = async (req, res) =>{
    const  {email}= req.body 

    const isSchool = await models.School.findOne({email})
    if(isSchool){
         /***
          * 
          */
        return res.status(400).json({"error":"School email already exist"})
    }
    const schoo = new models.School(req.body)
    schoo.save((err, scho)=>{
        consola.success({err, scho})
        if(err || !scho){
             /**
              * 
              */
            return  res.status(405).json({"error":"error in creating a school"})
        }
        res.status(200).json({"message":"school is created", school:scho})
    })
}

/**
 * get all the school
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
export const schools = async (req, res)=>{
   const data = await models.School.find()
   if(!data){
       /**
        * docs
        */
       return res.status(404).json({error:"fails to get users"})
   }
   res.json({message:"schools successfully fetched", data})
}

/**
 * school by Id
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @param {*} id 
 */
export const schoolById = async (req, res, next, id) =>{
    models.School.findById(id).exec((err, data)=>{
        if(err || !data){
            /**
             * 
             */
            res.status(404).json({"error":"school not found"})
        }
        req.school = data;
        next();
    });
}

/**
 * get Single school via school by Id
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */

export const school = async(req, res) =>{
    return res.status(200).json({message:"school successfully fetched", data:req.school})
}

/**
 * update school via school by Id
 * @param {*} req 
 * @param {*} res 
*/

export const updateSchool = async (req, res)=>{
    let update = _.extend(req.school,req.body)
    update.save((err, data)=>{
        if(err || !data){
            return res.status(403).json({error:"error in updating school detail", err})
        }
        res.status(200).json({message:"school successfully updated", data})

    })

}

/**
  * delete School vai school by Id
  * @param {*} req 
  * @param {*} res 
*/

export const deleteSchool = async (req, res)=>{
     let schol = req.school;
     schol.remove((err, data)=>{
         if(err || !data){
             return res.status(403).json({error:"fails to delete school", err})
         }
         res.status(200).json({message:"school succesfully deleted", data})
     })
}

/**
 * count all the school
 * @param {*} req 
 * @param {*} res 
 */

export const countSchool = async (req, res)=>{
    let count = await models.School.countDocuments();
    if(!count){
        return res.status(404).json({error:"failed to counts schoold"})
    }
    res.status(200).json({message:"schools successfully counted", data:count})
}


/**
 * get district a school by long to via school by Id
 * @param {*} req 
 * @param {*} res 
 */
export const schoolbelongtoDistrict = async (req, res)=>{
    let {_id} = req.school;
    models.School.find().populate('district').exec((err, data)=>{
        console.log({data, err})
        /**
         * docs
         */
        if(err || !data){
            return res.status(403).json({error:"fail to get district", err})
        }
        res.status(200).json({message:"successfully fetched district school belong to", data})
    })
}

export const studentInSchool = async (req, res )=>{
    const schol = req.school;
    schol.populate('student').exec((err, student)=>{
        if(err || !student){
            /**
             * 
             */
            return res.status(400).json({"error":"fail", err})
        }
        let total = student.countDocuments()
        res.status(200).json({"message":"success", data:{student, total}})
    })
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
              * 
              */
             res.status(404).json({"error":"District not exist"})
         }
         req.schoolByDistrict = district;
         next()
     })
}

export const schoolInDistrcit = async(req, res) =>{
    return res.status(200).json({message:"school successfully fetched", data:req.schoolByDistrict})
}

export const schoolInDistrcitCount = async(req, res) =>{
    //let data = req.schoolByDistrict.countDocuments();
    //data.countDocuments();
    return res.status(200).json({message:"school successfully fetched", data:req.schoolByDistrict,})
}


/**
 * Admin Students services  
*/

exports.createStudent = async (req, res) =>{
    const {studentCode} = req.body;
    /* 
    *docs
    */

   const isStudent = await  models.Student.findOne({studentCode});
   if(isStudent){
        /*
        *docs
        */
       return res.status(400).json({error:"Students already created"})
    }  
    
    const student = new models.Student(req.body);
    student.save((err, data)=>{
        //console.log({data, err})
        //console.log({err, data})
        if(err || !data){
            /* 
            */
            return res.status(401).json({error:"error in creating student, please try again",err})
        }
            /* 
            */
        res.status(200).json({message:"students successfully created, you can now login", data})
    }) 
}

exports.studentById= async (req, res, next, id)=>{
    models.Student.findById(id).exec((err, student)=>{
        //console.log({admin, err})
        if(err || !student){
            /**
             * docs
             */
            return res.status(404).json({error:"Students not found", err});
        }
        req.student = student;
        next();
    })
}

exports.updateStudent = async (req, res)=>{
    let student = _.extend(req.student, req.body)
    student.update_at = Date.now();
    student.save((err, data)=>{
        console.log({err, data})
        if(err){
            /*
            */
           return res.status(403).json({error:"fails to update students", err})
        }
        /**
         * docs
         */
        res.status(200).json({message:"students update successful", data})
    })
}

exports.deleteStudent = async (req, res)=>{
    let student = req.student;
    student.remove((err, data)=>{
        if(err || !data){
            /**
             * 
             */
            res.status(403).json({error:"fails to delete student", err})
        }
        /**
         * docs
         */
        res.status(200).json({message:"Student succesfully deleted", data})
    })
}

exports.student = async (req, res) =>{
    req.admin.salt= undefined
    req.admin.resetToken = undefined
    req.admin.hashed_password = undefined
    res.status(200).json(req.student)
}

exports.students = async (req, res) =>{
    const students =await models.Student.find();
    if(!students){
        /**
         * docs 
         */
        return res.status(404).json({error:"students not founds"})
    }
    res.status(200).json({message:"students successfully fetched", data:students})
}

exports.countStudent= async (req, res)=>{
    models.Student.aggregate([
        {
            $group: {
               _id: "$gender",
               count: { $sum: 1 }
            }
        }
    ])
    .exec((err, resp)=>{
        if(err ) return res.status(400).json({error:"error in count students by gender"})
        return res.json({message:"students successfully counted by gender",data:resp })
    })
}

exports.countStudentByYear = async (req, res)=>{
    models.Student.aggregate([
        {
            $group: {
                _id: "$yearAdmission",
                count:{$sum:1}
            }
        }
    ])
    .exec((err, resp)=>{
        if(err ) return res.status(400).json({error:"error in count students by year of Admission"})
        return res.json({message:"students successfully counted by year of Admission",data:resp })
    })
}

exports.countStudentByClass = async (req, res)=>{
    models.Student.aggregate([
        {
            $group: {
                _id: "$class",
                count:{$sum:1}
            }
        }
    ])
    .exec((err, resp)=>{
        if(err ) return res.status(400).json({error:"error in count students by Class"})
        return res.json({message:"students successfully counted by Class",data:resp })
    })
}

exports.countStudentByProvidence = async (req, res)=>{
    models.Student.aggregate([
        {
            $group: {
                _id: "$yearAdmission",
                count:{$sum:1}
            }
        }
    ])
    .exec((err, resp)=>{
        if(err ) return res.status(400).json({error:"error in count students by Providence"})
        return res.json({message:"students successfully counted by Providence",data:resp })
    })
}

exports.countStudentBySearch = async (req, res)=>{
    models.Student.aggregate([
        {
            $group: {
                _id: req.body,
                count:{$sum:1}
            }
        }
    ])
    .exec((err, resp)=>{
        if(err ) return res.status(400).json({error:"error in count students by Search"})
        return res.json({message:"students successfully counted by searching",data:resp })
    })
}













































