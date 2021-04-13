import _ from 'lodash';
import consola from 'consola';
import * as models from '../../../models'

/**
 * create a new school
 * @param {*} req 
 * @param {*} res 
 */
export const create = async (req, res) =>{
    const  {email }= req.body 
    //consola.success(req.body)
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

