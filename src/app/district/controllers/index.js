

import * as models from "../../../models";
import _ from 'loadash';

exports.create = async (req, res)=>{
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
    //const {_id, names, phone, email} = req.district;

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
    // #swagger.end
}

exports.update = async (req, res) => {
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

exports.delete = async (req, res) => {
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

exports.countSchoolInDistrict = async (req, res)=>{
    //const {_id} = req.district
    req.district.populate('school').countDocuments().exec((err, data)=>{
        if(err || !data){
            /**
             * docs
             */
            return res.status(404).json({error:"fails to count school", err})
        }
        /**
         * 
         */
        res.status(200).json({message:"schools successfully counted", data})
    })
}

exports.countstaffInDistrict = async (req, res)=>{
    //const {_id} = req.district
    req.district.populate('staff').countDocuments().exec((err, data)=>{
        if(err || !data){
            /**
             * docs
             */
            return res.status(404).json({error:"fails to count school", err})
        }
        /**
         * 
         */
        res.status(200).json({message:"schools successfully counted", data})
    })
}

exports.countstudentInDistrict = async (req, res)=>{
    //const {_id} = req.district
    req.district.populate('school').populate('student').countDocuments().exec((err, data)=>{
        console.log({err, data})
        if(err || !data){
            /**
             * docs
             */
            return res.status(404).json({error:"fails to count school", err})
        }
        /**
         * 
         */
        res.status(200).json({message:"schools successfully counted", data})
    })
}


exports.schoolInDistrict = async (req, res)=>{
    
}