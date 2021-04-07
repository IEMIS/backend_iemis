

import * as models from "../../../models";
//import _ from 'lodash';

exports.create = async (req, res,)=>{
    //let student = await models.Student.findById(id)
    let student = await models.Student.findOne({_id})
    if(!student){
        return res.status(404).json({error:"fails to find student"})
    }
    let exam = models.Exam(req.body)
    exam.save((err, data)=>{
        if(err || !data){
            return res.status(403).json({error:"fails to save exam record", err})
        }
        res.status(200).json({message:"exam successfully added to the student record", data})
    })
}











