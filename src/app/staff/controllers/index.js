

import * as models from "../../../models";
import _ from 'lodash';

exports.create = async (req, res)=>{
    const {email} = req.body;
    /*
    */
   const isStaff = await  models.Staff.findOne({email});
   if(!isStaff){
        /*
        */
       return res.status(400).json({error:"staff already created"})
    }  
    const staff = new models.Staff(req.body);
    staff.save((err, data)=>{
        console.log({err, data})
        if(err || !data){

            /*
            *
            */
            return res.status(401).json({error:"error in creating staff, please try again",err})
        }

            /*  
            */
        res.status(200).json({message:"staff successfully created", data})
    })
}

exports.staffs = async (req, res)=>{
    /*
    */
   models.Staff.find((err, data)=>{
       if(err || !data){
           /* 
            */
           return res.status(404).json({error:"Staff is not available",err})
        }
        /*
        */
       return res.status(200).json({"mesage":"staff is successfully fetched",data})
   })
}

exports.staffById= async (req, res, next,id)=>{
    /* 
    */
    models.Staff.findById(id).exec((err, staff)=>{
        if(err || !staff){ 
            /*
            */
            return res.status(404).json({error: "staff not found"})
        }
        req.staff = staff;
        next()
    })
}

exports.staff = async (req, res)=>{
    /*  
    */
    res.status(200).json({message:"staff succesfully fetched", data:req.staff})
    // #swagger.end
}

exports.update = async (req, res) => {
 
    let staff= req.staff
    staff = _.extend(staff,req.body);
    staff.update_at = Date.now();
    staff.save((err,data)=>{
        if(err ||!data) {
          /* 
            */
            return res.json({error: "error in update staff"})
        }

        /* 
 
        */
        res.json({data,message:"staff succesfully updated"})
    })
};

exports.delete = async (req, res) => {
    /* 
    */
    const staff = req.staff
    staff.remove((err, data)=>{
        if(err){
             /* #swagger.responses[400] = {
                description: "Error in deleting staff",
                schema: { 
                    "error ":"Error in deleting staff",
                }
            } 
            */
            return res.status(400).json({error:"Error in deleting staff"});
        }
         /* 
            #swagger.responses[200] = {
                description: "staff successfully deleted",
                schema: { 
                    "message ":"staff successfully deleted",
                    "data":{
                        "_id":"002whhe",
                        "firstName":"adem",
                        "lastName":"Oluyemi",
                        "email":"adin@gmail.com"
                    }
                 }
            } 
        */
        return res.json({message:"staff successfully deleted", data})
    })
};

exports.countStaff = async (req, res)=>{
    models.Staff.countDocuments().exec((err, data)=>{
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
        res.status(200).json({message:"Staff successfully counted", data})
    })
}
