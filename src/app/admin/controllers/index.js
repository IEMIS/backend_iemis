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


exports.createDistric = async (req, res)=>{
    const {email, password, names,code, address, phone} = req.body;
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
   const isDistrict = await  District.findOne({email});
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
    const district = new District({email,code,address, password, phone, names});
    district.save((err, data)=>{
        console.log({err, data})
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

exports.districtList = async (req, res)=>{
    /* 
      #swagger.tags = ['Admin services']
      #swagger.description = 'List of all district' 
    */
   District.find((err, data)=>{
       if(err || !data){
           /* #swagger.responses[404] = {
                description: "Find all the district",
                schema: { 
                    "error ":"Disrict is not available",
                }
            } 
            */
           return res.status(404).json({error:"Disrict is not available",err})
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
       return res.status(200).json({"mesage":"Disrict is successfully fetched",data})
   })
}

exports.districtById= async (req, res, next,id)=>{
    // #swagger.start
    /* 
      #swagger.tags = ['Admin services']
      #swagger.description = 'Endpoint to create a new district' 
      #swagger.parameters['districtById'] = { description: "District  ID" } 
    */
    District.findById(id).exec((err, user)=>{
        if(err || !user){ 
            /* #swagger.responses[401] = {
                description: "District not found",
                schema: { 
                    "error ":"District not found",
                }
            } 
            */
            return res.status(404).json({error: "District not found"})
        }
        req.district = user;
        next()
    })
    // #swagger.start
}

exports.oneDistrict = async (req, res)=>{
    // #swagger.start
    const {_id, name, phone, email} = req.district;

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
    res.status(200).json({message:"district succesfully fetched", data:{_id, name, phone, email}})
    // #swagger.end
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
            return res.json({error: "error in update district"})
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

