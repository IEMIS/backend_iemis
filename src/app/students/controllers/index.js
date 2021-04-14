import _ from 'lodash';
import * as models from '../../../models'


exports.create = async (req, res) =>{
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

exports.update = async (req, res)=>{
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

exports.delete = async (req, res)=>{
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

exports.countStudents= async (req, res)=>{
    models.Student.countDocuments().exec((err, result)=>{
        if(err || !result){
            /**
             * docs for not count
             */
            return res.status(404).json({error:"fails to count documents", err})
        }
        res.status(200).json({message:"students successfully count", data:result})
    });
}

exports.studentByGender = async (req, res)=>{

}



