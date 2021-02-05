
const Admin = require("../../models/admin");
const District = require("../../models/district");

exports.create = async (req, res) =>{
    const {email, password, firstName, lastName, middleName, phone} = req.body;
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
                    $password: "password_demo_123",
                    "firstName" : "ade",
                    "lastName" : "lastName",
                    "middleName" : "ola"
                }
       } 
    */
   const isAdmin = await  Admin.findOne({email});
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
    const admin = new Admin ({email, lastName, firstName,middleName, password, phone});
    admin.save((err, data)=>{
        console.log({err, data})
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


exports.createDistric = async (req, res)=>{
    const {email, password, name, phone} = req.body;
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
                    $password: "password",
                    "name" : "ade",
                    "phone" : "09045677"
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
    const district = new District({email, password, phone, name});
    district.save((err, data)=>{
        console.log({err, data})
        if(err || !data){

            /* #swagger.responses[401] = {
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
    /* 
      #swagger.tags = ['Admin services']
      #swagger.description = 'Endpoint to create a new district' 
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
}

exports.oneDistrict = async (req, res)=>{
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