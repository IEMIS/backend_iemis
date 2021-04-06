import * as models from "../../../models";
import _ from 'lodash';

exports.create = async (req, res)=>{
    const {email} = req.body;
    /* 
    *
    */
   const isTeacher = await  models.Teacher.findOne({email});
   if(isTeacher){
        /* 
        *
        */
       return res.status(400).json({error:"Teacher already created"})
    }  
    const teacher = new models.Teacher(req.body);
    teacher.save((err, data)=>{
        console.log({err, data})
        if(err || !data){
            /*
            */
            return res.status(401).json({error:"error in creating Teacher, please try again",err})
        }
        /* 
        */
        res.status(200).json({message:"Teacher is successfully created", data})
    })
}

exports.teachers= async (req, res)=>{
    /* 
    */
   models.Teacher.find((err, data)=>{
       if(err || !data){
        /* 
        */
           return res.status(404).json({error:"Teacher is not available",err})
        }
        /*
        */
       return res.status(200).json({"mesage":"Teacher is successfully fetched",data})
   })
}

exports.teacherById= async (req, res, next,id)=>{
    /* 
    */
    models.Teacher.findById(id).exec((err, teacher)=>{
        if(err || !teacher){ 
            /*
            */
            return res.status(404).json({error: "Teacher not found"})
        }
        req.teacher = teacher;
        next()
    })
}

exports.teacher = async (req, res)=>{
    /* 
    */
    res.status(200).json({message:"teacher is succesfully fetched", data:req.teacher})
}

exports.update = async (req, res) => {
    /* 
    */
    let teacher = _.extend(req.teacher,req.body);
    teacher.update_at = Date.now();
    teacher.save((err,data)=>{
        if(err ||!data) {
          /*
            */
            return res.json({error: "error in update Teacher"})
        }
        /* 
        */
        res.json({data,message:"Teacher is succesfully updated"})
    })
};

exports.delete = async (req, res) => {
    /* 
    */
    const teacher = req.teacher
    teacher.remove((err, data)=>{
        if(err){
            /* 
            */
            return res.status(400).json({error:"Error in deleting teacher"});
        }
        /* 
        */
        return res.json({message:"teacher is successfully deleted", data})
    })
};

exports.countTeacher = async (req, res)=>{
    models.Teacher.countDocuments().exec((err, data)=>{
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
        res.status(200).json({message:"Teachers is successfully counted", data})
    })
}




