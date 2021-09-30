const  _ = require('lodash')
const mongoose = require("mongoose")
const models = require('../../../models')

exports.districtById= async (req, res, next,id)=>{
    models.District.findById(id).exec((err, dist)=>{
        if(err || !dist){ 
            return res.status(404).json({error: "District not found"})
        }
        req.district = dist;
        next()
    })
}

exports.district = async (req, res)=>{
    res.status(200).json({message:"district succesfully fetched", data:req.district})
}

exports.updateDistrict = async (req, res) => {
    let district = req.district
    district = _.extend(district,req.body);
    district.update_at = Date.now();
    district.save((err,data)=>{
        if(err ||!data) {
            return res.json({error: "error in updating district"})
        }
        res.json({data,message:"district succesfully updated"})
    })
};

exports.createSchool = async (req, res) =>{
    const  {email}= req.body 
    const isSchool = await models.School.findOne({email})
    if(isSchool){
        return res.status(400).json({"error":"School email already exist"})
    }
    const schoo = new models.School(req.body)
    schoo.save((err, scho)=>{
        if(err || !scho){
            return  res.status(405).json({"error":"error in creating a school"})
        }
        res.status(200).json({"message":"school is created", school:scho})
    })
}

exports.schools = async (req, res)=>{
    if(!req.params.district){
        return res.status(404).json({error:"District required"})
    }
    let district = mongoose.Types.ObjectId(req.params.district);
    // { $match : {district}}
    const data = await models.School.aggregate([
        { $match : {district}},
        { $lookup: { from: "districts", localField: "district", foreignField: "_id", as: "fromDistrict"}},
    ]).exec();
    if(!data){
       return res.status(404).json({error:"fails to get users"})
    }
    res.status(200).json({message:"schools successfully fetched", data})
}

exports.schoolById = async (req, res, next, id) =>{
    let ids = mongoose.Types.ObjectId(id);
    const data = await models.School.aggregate([
        { $match: {_id:ids}},
        { $lookup: { from: "districts", localField: "district", foreignField: "_id", as: "fromDistrict"}},
    ]).exec();
    if(!data){
        res.status(404).json({"error":"school not found"})
    }
    req.school = data;
    next();
}
exports.school = async(req, res) =>{
    return res.status(200).json({message:"school successfully fetched", data:req.school})
}

exports.updateSchool = async (req, res)=>{
    //let updateSch = req.school[0]
    //console.log(updateSch,req.body)
    //updateSch = _.extend(updateSch,req.body)
    //console.log(updateSch)
    res.status(200).json({message:"school successfully updated"})
    // updateSch.updatedAt = Date.now();
    // updateSch.save((err,data)=>{
    //     if(err || !data){
    //         return res.status(403).json({error:"error in updating school detail", err})
    //     }
    //     res.status(200).json({message:"school successfully updated", data})
    // })
}

exports.deleteSchool = async (req, res)=>{
    let schol = req.school[0];
    //console.log(schol)
    return res.status(403).json({error:"fails to delete school"})
    // schol.remove((err, data)=>{
    //     if(err || !data){
    //         return res.status(403).json({error:"fails to delete school", err})
    //     }

    //     res.status(200).json({message:"school succesfully deleted", data})
    // })
}

exports.schoolData = async (req, res) =>{
    if(!req.params.district){
        return res.status(404).json({error:"District required"})
    }
    let district = mongoose.Types.ObjectId(req.params.district);

    let countSchool = await models.School.countDocuments({district});
    let countSchoolByDistrict = await models.School.aggregate([
        { $match : {district}},
        { $group : { _id:"$district", count:{$sum:1}}},
        { $lookup: { from: "districts", localField: "_id", foreignField: "_id", as: "fromDistrict"}},
        { $replaceRoot: { newRoot: { $mergeObjects: [ { $arrayElemAt: [ "$fromDistrict", 0 ] }, "$$ROOT" ] } }},
        { $project: { fromDistrict: 0 } },
        //{ $sort: { count: -1 } },
    ]).exec();
    let countSchoolByEduLevel = await models.School.aggregate([
        { $match : {district}},
        { $group : {_id:"$eduLevel", count:{$sum:1}}},
        { $sort: { count: -1 } },
    ]).exec();
    let countSchoolByownership = await models.School.aggregate([
        { $match : {district}},
        {$group : {_id:"$ownership", count:{$sum:1}}},
        { $sort: { count: -1 } },
    ]).exec();
    let countSchoolByType = await models.School.aggregate([
        { $match : {district}},
        {$group : {_id:"$schoolType", count:{$sum:1}}},
        { $sort: { count: -1 } },
    ]).exec();
    let countSchoolByCat = await models.School.aggregate([
        { $match : {district}},
        {$group : {_id:"$schoolCat", count:{$sum:1}}},
        { $sort: { count: -1 } },
    ]).exec();

    res.status(404).json({message:"school data", data:{countSchool, countSchoolByDistrict, countSchoolByEduLevel, countSchoolByownership, countSchoolByType, countSchoolByCat}})
}


exports.createStudent = async (req, res) =>{
    const student = new models.Student(req.body);
    student.save((err, data)=>{
        //console.log({err, data})
        if(err || !data){
            return res.status(401).json({error:"error in creating student, please try again",err})
        }
        res.status(200).json({message:"students successfully created, you can now login", data})
    }) 
}

exports.students = async (req, res) =>{
    if(!req.params.district){
        return res.status(404).json({error:"District required"})
    }
    let district = mongoose.Types.ObjectId(req.params.district);
    const data = await models.Student.aggregate([
        { $match : {district}},
        { $lookup: { from: "districts", localField: "district", foreignField: "_id", as: "fromDistrict"}},
        { $lookup: { from: "schools", localField: "school", foreignField: "_id", as: "fromSchool"}},
        { $lookup: { from: "sessions", localField: "session", foreignField: "_id", as: "fromSession"}},
        { $lookup: { from: "classes", localField: "presentClass", foreignField: "_id", as: "fromClass"}},
    ]).exec();
    if(!data){
       return res.status(404).json({error:"fails to get users"})
    }
    res.status(200).json({message:"students successfully fetched", data}) 
}

exports.studentById= async (req, res, next, id)=>{
    let ids = mongoose.Types.ObjectId(id);
    const data = await models.Student.aggregate([
        { $match: { _id: ids}},
        { $lookup: { from: "districts", localField: "district", foreignField: "_id", as: "fromDistrict"}},
        { $lookup: { from: "schools", localField: "school", foreignField: "_id", as: "fromSchool"}},
        { $lookup: { from: "sessions", localField: "session", foreignField: "_id", as: "fromSession"}},
        { $lookup: { from: "classes", localField: "presentClass", foreignField: "_id", as: "fromClass"}},
        //{ $replaceRoot: { newRoot: { $mergeObjects: [ { $arrayElemAt: [ "$fromDistrict", 0 ] }, "$$ROOT" ] } }},
        //{ $project: { fromDistrict: 0 } }
    ]).exec();
    //console.log({ data})
    if(!data){
        return res.status(404).json({error:"Students not found", err});
    }
    req.student = data;
    next();  
}

exports.student = async (req, res) =>{
    res.status(200).json({message:"student sucessfully fetched", data:req.student})
}
exports.updateStudent = async (req, res)=>{
    let student = _.extend(req.student, req.body)
    student.update_at = Date.now();
    // student.save((err, data)=>{
    //     if(err){
    //        return res.status(403).json({error:"fails to update students", err})
    //     }
    //     res.status(200).json({message:"students update successful", data})
    // })
    return res.status(200).json({message:"students update successful"})
}
exports.deleteStudent = async (req, res)=>{
    let student = req.student[0];
    // student.remove((err, data)=>{
    //     if(err || !data){
    //         return res.status(403).json({error:"fails to delete student", err})
    //     }
    //     res.status(200).json({message:"Student succesfully deleted", data})
    // })
    return res.status(403).json({error:"fails to delete student"})
}

exports.countStudentByClassAll= async (req, res)=>{
    if(!req.params.district){
        return res.status(404).json({error:"District required"})
    }
    // if(!session){
    //     return res.status(404).json({error:"Session required"})
    // }

    let district = mongoose.Types.ObjectId(req.params.district);
    const male = await models.Student.aggregate([
        { $match: { $and: [{ gender: "Male" }, {district}]} },
        { $group: { _id: "$presentClass", count: { $sum: 1 } } },
        { $lookup: { from: "classes", localField: "_id", foreignField: "_id", as: "fromClass"}},
        { $replaceRoot: { newRoot: { $mergeObjects: [ { $arrayElemAt: [ "$fromClass", 0 ] }, "$$ROOT" ] } }},
        { $project: { fromClass: 0 } }
    ]).exec();
    const female = await models.Student.aggregate([
        // { $match: { gender: "Female" } },
        { $match: { $and: [{ gender: "Female" }, {district}]} },
        { $group: { _id: "$presentClass", count: { $sum: 1 } } },
        { $lookup: { from: "classes", localField: "_id", foreignField: "_id", as: "fromClass"}},
        { $replaceRoot: { newRoot: { $mergeObjects: [ { $arrayElemAt: [ "$fromClass", 0 ] }, "$$ROOT" ] } }},
        { $project: { fromClass: 0 } }
    ]).exec();
    const total = await models.Student.aggregate([
        { $match: { district: district } },
        { $group: { _id: "$presentClass", count: { $sum: 1 } } },
        { $lookup: { from: "classes", localField: "_id", foreignField: "_id", as: "fromClass"}},
        { $replaceRoot: { newRoot: { $mergeObjects: [ { $arrayElemAt: [ "$fromClass", 0 ] }, "$$ROOT" ] } }},
        { $project: { fromClass: 0 } }
    ]).exec();
  
    const data = [
        {
            key: "Male",
            color: "#FE8A7D",
            values: male,
        },
        {
            key: "Female",
            color: "#1de9b6",
            values: female,
        },
        {
            key: "Total",
            color: "#3ebfea",
            values: total,
        },
    ]
    return res.status(200).json ({message:"students successfully counted by Class", data })
}

exports.countStudentByClassInSchool= async (req, res)=>{
    if(!req.params.school){
        return res.status(404).json({error:"School required"})
    }
    // if(!session){
    //     return res.status(404).json({error:"Session required"})
    // }

    let school = mongoose.Types.ObjectId(req.params.school);
    const male = await models.Student.aggregate([
        { $match: { $and: [{ gender: "Male" }, {school}]} },
        { $group: { _id: "$presentClass", count: { $sum: 1 } } },
        { $lookup: { from: "classes", localField: "_id", foreignField: "_id", as: "fromClass"}},
        { $replaceRoot: { newRoot: { $mergeObjects: [ { $arrayElemAt: [ "$fromClass", 0 ] }, "$$ROOT" ] } }},
        { $project: { fromClass: 0 } }
    ]).exec();
    const female = await models.Student.aggregate([
        // { $match: { gender: "Female" } },
        { $match: { $and: [{ gender: "Female" }, {school}]} },
        { $group: { _id: "$presentClass", count: { $sum: 1 } } },
        { $lookup: { from: "classes", localField: "_id", foreignField: "_id", as: "fromClass"}},
        { $replaceRoot: { newRoot: { $mergeObjects: [ { $arrayElemAt: [ "$fromClass", 0 ] }, "$$ROOT" ] } }},
        { $project: { fromClass: 0 } }
    ]).exec();
    const total = await models.Student.aggregate([
        { $match: { school} },
        { $group: { _id: "$presentClass", count: { $sum: 1 } } },
        { $lookup: { from: "classes", localField: "_id", foreignField: "_id", as: "fromClass"}},
        { $replaceRoot: { newRoot: { $mergeObjects: [ { $arrayElemAt: [ "$fromClass", 0 ] }, "$$ROOT" ] } }},
        { $project: { fromClass: 0 } }
    ]).exec();
  
    const data = [
        {
            key: "Male",
            color: "#FE8A7D",
            values: male,
        },
        {
            key: "Female",
            color: "#1de9b6",
            values: female,
        },
        {
            key: "Total",
            color: "#3ebfea",
            values: total,
        },
    ]
    return res.status(200).json ({message:"students successfully counted by Class", data })
}

exports.StudentData = async (req, res) =>{
    //const { session} = req.body
    if(!req.params.district){
        return res.status(404).json({error:"District required"})
    }
    // if(!session){
    //     return res.status(404).json({error:"Session required"})
    // }
    let district = mongoose.Types.ObjectId(req.params.district);
    console.log(district)

    const countStudent = await models.Student.countDocuments({district});
    const countStudentByGender = await models.Student.aggregate([
        {$match: {district}},
        {$group: {  _id: "$gender", "count": { $sum: 1 }, total :{$sum:"$count"}}},
        {$addFields: { totalScore:{ $sum: "$count"} }},
    ]).exec();
    const countStudentByYear = await models.Student.aggregate([
        {$match: {district}},
        {$project : {year:{$year:"$yearAdmission"}}},
        {$group: {_id: "$year",count:{$sum:1},total:{$sum:+1}}}
    ]).exec();
    //const countStudentByClass = await this.countStudentByClassAll();
    const countStudentByClass = ({a:"hello", data:"data"})
    const countStudentBySchool = await models.Student.aggregate([
        {$match: {district}},
        {$group: {  _id: "$school", "count": { $sum: 1 } }},
        {$lookup: {from: "schools", localField:"_id", foreignField:"_id", as:"fromSchool"}}
    ]).exec();
    const countStudentByAge = await models.Student.aggregate([
        {$match: {district}},
        {$group :{ _id:"$age", count:{$sum:1}}}
    ]).exec();
    const countStudentByEduLevel = await models.Student.aggregate([
        {$match: {district}},
        {$group :{ _id:"$edulevel", count:{$sum:1}}}
    ]).exec();
    const countStudentByDistrict = await models.Student.aggregate([
        {$match: {district}},
        {$group :{ _id:"$district", count:{$sum:1}}},
        { $lookup: { from: "districts", localField: "_id", foreignField: "_id", as: "fromDistrict"}},
    ]).exec();
    const countStudentByReligion = await models.Student.aggregate([
        {$match: {district}},
        {$group :{ _id:"$religion", count:{$sum:1}}},
    ]).exec();
    const countStudentByCountry = await models.Student.aggregate([
        {$match: {district}},
        {$group :{ _id:"$country", count:{$sum:1}}},
    ]).exec();
    const countStudentByEthnicity = await models.Student.aggregate([
        {$match: {district}},
        {$group :{ _id:"$ethnicity", count:{$sum:1}}},
    ]).exec();
    const countStudentByProvince = await models.Student.aggregate([
        {$match: {district}},
        {$group :{ _id:"$province", count:{$sum:1}}},
    ]).exec();
    const countStudentBySession= await models.Student.aggregate([
        { $match: {district}},
        { $group :{ _id:"$session", count:{$sum:1}}},
        { $lookup: { from: "sessions", localField: "_id", foreignField: "_id", as: "fromSession"}},
        { $replaceRoot: { newRoot: { $mergeObjects: [ { $arrayElemAt: [ "$fromSession", 0 ] }, "$$ROOT" ] } }},
        { $project: { fromSession: 0 } }
    ]).exec();
    const countStudentByStatus= await models.Student.aggregate([
        {$match: {district}},
        {$group :{ _id:"$status", count:{$sum:1}}},
    ]).exec();
    res.status(200).json({message:"school data successfully fetched",data:{countStudent,countStudentByGender,countStudentByYear,countStudentByClass,countStudentBySchool,countStudentByAge,countStudentByEduLevel,countStudentByDistrict,countStudentByReligion,countStudentByCountry,countStudentByEthnicity,countStudentByProvince,countStudentBySession,countStudentByStatus} })
}

exports.StudentDataBySchool = async (req, res) =>{
    if(!req.params.school){
        return res.status(404).json({error:"School required"})
    }
    let school= mongoose.Types.ObjectId(req.params.school);

    const countStudent = await models.Student.countDocuments({school});
    const countStudentByGender = await models.Student.aggregate([
        {$match: {school}},
        {$group: {  _id: "$gender", "count": { $sum: 1 }, total :{$sum:"$count"}}},
        {$addFields: { totalScore:{ $sum: "$count"} }},
    ]).exec();
    const countStudentByYear = await models.Student.aggregate([
        {$match: {school}},
        {$project : {year:{$year:"$yearAdmission"}}},
        {$group: {_id: "$year",count:{$sum:1},total:{$sum:+1}}}
    ]).exec();
    //const countStudentByClass = await this.countStudentByClassAll();
    // const countStudentByClass = ({a:"hello", data:"data"})
    // const countStudentBySchool = await models.Student.aggregate([
    //     {$match: {school}},
    //     {$group: {  _id: "$school", "count": { $sum: 1 } }},
    //     {$lookup: {from: "schools", localField:"_id", foreignField:"_id", as:"fromSchool"}}
    // ]).exec();
    const countStudentByAge = await models.Student.aggregate([
        {$match: {school}},
        {$group :{ _id:"$age", count:{$sum:1}}}
    ]).exec();
    const countStudentByEduLevel = await models.Student.aggregate([
        {$match: {school}},
        {$group :{ _id:"$edulevel", count:{$sum:1}}}
    ]).exec();
    // const countStudentByDistrict = await models.Student.aggregate([
    //     {$match: {school}},
    //     {$group :{ _id:"$school", count:{$sum:1}}},
    //     { $lookup: { from: "school", localField: "_id", foreignField: "_id", as: "fromSchool"}},
    // ]).exec();
    const countStudentByReligion = await models.Student.aggregate([
        {$match: {school}},
        {$group :{ _id:"$religion", count:{$sum:1}}},
    ]).exec();
    const countStudentByCountry = await models.Student.aggregate([
        {$match: {school}},
        {$group :{ _id:"$country", count:{$sum:1}}},
    ]).exec();
    const countStudentByEthnicity = await models.Student.aggregate([
        {$match: {school}},
        {$group :{ _id:"$ethnicity", count:{$sum:1}}},
    ]).exec();
    const countStudentByProvince = await models.Student.aggregate([
        {$match: {school}},
        {$group :{ _id:"$province", count:{$sum:1}}},
    ]).exec();
    const countStudentBySession= await models.Student.aggregate([
        { $match: {school}},
        { $group :{ _id:"$session", count:{$sum:1}}},
        { $lookup: { from: "sessions", localField: "_id", foreignField: "_id", as: "fromSession"}},
        { $replaceRoot: { newRoot: { $mergeObjects: [ { $arrayElemAt: [ "$fromSession", 0 ] }, "$$ROOT" ] } }},
        { $project: { fromSession: 0 } }
    ]).exec();
    const countStudentByStatus= await models.Student.aggregate([
        {$match: {school}},
        {$group :{ _id:"$status", count:{$sum:1}}},
    ]).exec();
    res.status(200).json({
        message:"school data successfully fetched",
        data:{countStudent,countStudentByGender,countStudentByYear,countStudentByAge,countStudentByEduLevel,countStudentByReligion,countStudentByCountry,countStudentByEthnicity,countStudentByProvince,countStudentBySession,countStudentByStatus} 
    })
}


exports.studentIndicators = async (req, res)=>{
    // Using query builder, we can latter move
    const {yearA, pclass} = req.body;
    const gi = await models.Student.find({/**explicit find by district */}).where('presentClass').equals(pclass).where('yearAdmission').equals(yearA).exec();
    //{district:"60d88b1a6040b7073c8112e0"}).where('presentClass').equals("60d103c2aa056b4de034ed42").where('yearAdmission').equals("2021").exec()
    const gir = await models.Student.find().where('presentClass').equals("60d103c2aa056b4de034ed42").where('yearAdmission').equals("2021-07-27T00:00:00.000Z").countDocuments();
    /**gross intake by district */
    const grossInTake = await models.Student.aggregate([
        { $match: { presentClass: "", yearAdmission:"" } },
        { $group: { _id: "/* deep looking district by school **/", count: { $sum: 1 } } },
    ]).exec();
    const netIntake = await models.Student.aggregate([
        { $match: { presentClass: "", yearAdmission:"", /**accept function against dob field to get year */ } },
        { $group: { _id: "/* deep looking district by school **/", count: { $sum: 1 } } },
    ]).exec();

    const aNetinTake = await models.Student.aggregate([
        { $match: { presentClass: "", yearAdmission:"", /**accept function against dob field to get year */ } },
        { $group: { _id: "_id", count: { $sum: 1 } } },
    ]).exec();

    const netEnroll= await models.Student.aggregate([
        { $match: { yearAdmission:"", /**accept function against dob field to get year */ } },
        { $group: { _id: "/** deep find by school EduLevel*/", count: { $sum: 1 } } },
    ]).exec();

    return res.status(200).json({message:"indicators", gir,})
}

exports.indicators = async (req, res) =>{
    // const {year, classid, dob } = req.body;
    // let classId = mongoose.Types.ObjectId(classid);
    // result: { $and: [ { $gt: [ "$qty", 100 ] }, { $lt: [ "$qty", 250 ] } ] }
    // const grossIntake = await models.Student.aggregate([
    //     { $match: { $and: [ {presentClass:classId, yearAdmission:"2020"}]} },
    //     { $group: { _id: "$_id", count: { $sum: 1 } } },
    // ]).exec();

    // const netIntake = await models.Student.aggregate([
    //     { $match: { $and: [ {presentClass: classId, yearAdmission:"2020", age:[{ $lt:6, $gt:7}]}]} },
    //     { $group: { _id: "$_id", count: { $sum: 1 } } },
    // ]).exec();

    const aNetIntakeMale = await models.Student.aggregate([
        { $match: { $and: [ { yearAdmission:"2020",gender:"Male", age:[{ $lt:6, $gt:7}]}]} },
        { $group: { _id: "$_id", count: { $sum: 1 } } },
    ]).exec();
    const aNetIntakeFemale = await models.Student.aggregate([
        { $match: { $and: [ { yearAdmission:"2020",gender:"Female", age:[{ $lt:6, $gt:7}]}]} },
        { $group: { _id: "$_id", count: { $sum: 1 } } },
    ]).exec();
    const aNetIntakeTotal = await models.Student.aggregate([
        { $match: { $and: [ { yearAdmission:"2020", age:[{ $lt:6, $gt:7}]}]} },
        { $group: { _id: "$_id", count: { $sum: 1 } } },
    ]).exec();

    const aNetIntake = [
        {
            key: "Male",
            color: "#FE8A7D",
            values: aNetIntakeMale,
        },
        {
            key: "Female",
            color: "#1de9b6",
            values: aNetIntakeFemale,
        },
        {
            key: "Total",
            color: "#3ebfea",
            values: aNetIntakeTotal,
        },
    ]

    const grossEnrollMale = await models.Student.aggregate([
        { $match: { $and: [{session:"2020", gender:"Male"}]}},
        { $group: { _id: "$eduLevel", count: { $sum: 1 } } },
    ]).exec();
    const grossEnrollFemale = await models.Student.aggregate([
        { $match: { $and: [{session:"2020", gender:"Female"}]}},
        { $group: { _id: "$eduLevel", count: { $sum: 1 } } },
    ]).exec();
    const grossEnrollTotal = await models.Student.aggregate([
        { $match: { $and: [{session:"2020"}]}},
        { $group: { _id: "$eduLevel", count: { $sum: 1 } } },
    ]).exec();

    const grossEnroll = [
        {
            key: "Male",
            color: "#FE8A7D",
            values: grossEnrollMale,
        },
        {
            key: "Female",
            color: "#1de9b6",
            values: grossEnrollFemale,
        },
        {
            key: "Total",
            color: "#3ebfea",
            values: grossEnrollTotal,
        },
    ]

    const netEnrollMale = await models.Student.aggregate([
        { $match: { $and: [ { session:"2020", gender:"Male", age:[{ $lt:6, $gt:7}]}]} },
        { $group: { _id: "$eduLevel", count: { $sum: 1 } } },
    ]).exec();
    const netEnrollFemale = await models.Student.aggregate([
        { $match: { $and: [ { session:"2020",gender:"Female", age:[{ $lt:6, $gt:7}]}]} },
        { $group: { _id: "$eduLevel", count: { $sum: 1 } } },
    ]).exec();
    const netEnrollTotal= await models.Student.aggregate([
        { $match: { $and: [ { session:"2020",gender:"Female", age:[{ $lt:6, $gt:7}]}]} },
        { $group: { _id: "$eduLevel", count: { $sum: 1 } } },
    ]).exec();

    const netEnroll = [
        {
            key: "Male",
            color: "#FE8A7D",
            values: netEnrollMale,
        },
        {
            key: "Female",
            color: "#1de9b6",
            values: netEnrollFemale,
        },
        {
            key: "Total",
            color: "#3ebfea",
            values: netEnrollTotal,
        },
    ]

    const ageSpecMale = await models.Student.aggregate([
        { $match: { gender:"Male"}},
        { $group: { _id: "$age", count: { $sum: 1 } } },
    ]).exec();
    const ageSpecFemale = await models.Student.aggregate([
        { $match: { gender:"Female"}},
        { $group: { _id: "$age", count: { $sum: 1 } } },
    ]).exec();
    const ageSpecTotal = await models.Student.aggregate([
        { $group: { _id: "$age", count: { $sum: 1 } } },
    ]).exec();
    const ageSpec = [
        {
            key: "Male",
            color: "#FE8A7D",
            values: ageSpecMale,
        },
        {
            key: "Female",
            color: "#1de9b6",
            values: ageSpecFemale,
        },
        {
            key: "Total",
            color: "#3ebfea",
            values: ageSpecTotal,
        },
    ]

    const outOfSchoolMale = await models.Student.aggregate([
        { $match: { $and: [ { session:"2020", gender:"Male", age:[{ $lt:6, $gt:14}]}]} },
        { $group: { _id: "$_id", count: { $sum: 1 } } },
    ]).exec();
    const outOfSchoolFemale = await models.Student.aggregate([
        { $match: { $and: [ { session:"2020", gender:"Female", age:[{ $lt:6, $gt:14}]}]} },
        { $group: { _id: "$_id", count: { $sum: 1 } } },
    ]).exec();
    const outOfSchoolTotal = await models.Student.aggregate([
        { $match: { $and: [ { session:"2020", age:[{ $lt:6, $gt:14}]}]} },
        { $group: { _id: "$_id", count: { $sum: 1 } } },
    ]).exec();
    const outOfSchool = [
        {
            key: "Male",
            color: "#FE8A7D",
            values: outOfSchoolMale,
        },
        {
            key: "Female",
            color: "#1de9b6",
            values: outOfSchoolFemale,
        },
        {
            key: "Total",
            color: "#3ebfea",
            values: outOfSchoolTotal,
        },
    ]

    const transitionMale = await models.Student.aggregate([
        { $match: { $and: [ { session:"2020", status:"graduated", gender:"Male"}]} },
        { $group: { _id: "$edulevel", count: { $sum: 1 } } },
    ]).exec();
    const transitionFemale = await models.Student.aggregate([
        { $match: { $and: [ { session:"2020", status:"graduated", gender:"Female"}]} },
        { $group: { _id: "$edulevel", count: { $sum: 1 } } },
    ]).exec();
    const transitionTotal = await models.Student.aggregate([
        { $match: { $and: [ { session:"2020", status:"graduated"}]} },
        { $group: { _id: "$edulevel", count: { $sum: 1 } } },
    ]).exec();
    const transition = [
        {
            key: "Male",
            color: "#FE8A7D",
            values: transitionMale,
        },
        {
            key: "Female",
            color: "#1de9b6",
            values: transitionFemale,
        },
        {
            key: "Total",
            color: "#3ebfea",
            values: transitionTotal,
        },
    ]

    const repetitionMale = await models.Student.aggregate([
        { $match: { $and: [ { session:"2020", status:"repeater", gender:"Male"}]} },
        { $group: { _id: "$presentClass", count: { $sum: 1 } } },
    ]).exec();
    const repetitionFemale = await models.Student.aggregate([
        { $match: { $and: [ { session:"2020", status:"repeater", gender:"Female"}]} },
        { $group: { _id: "$presentClass", count: { $sum: 1 } } },
    ]).exec();
    const repetitionTotal = await models.Student.aggregate([
        { $match: { $and: [ { session:"2020", status:"repeater",}]} },
        { $group: { _id: "$presentClass", count: { $sum: 1 } } },
    ]).exec();

    const repetition = [
        {
            key: "Male",
            color: "#FE8A7D",
            values: repetitionMale,
        },
        {
            key: "Female",
            color: "#1de9b6",
            values: repetitionFemale,
        },
        {
            key: "Total",
            color: "#3ebfea",
            values: repetitionTotal,
        },
    ]

    const survivalMale = await models.Student.aggregate([
        { $match: { status:"promoted"} },
        { $group: { _id: "$presentClass", count: { $sum: 1 } } },
    ]).exec();
    const survivalFemale = await models.Student.aggregate([
        { $match: { status:"promoted"} },
        { $group: { _id: "$presentClass", count: { $sum: 1 } } },
    ]).exec();
    const survivalTotal = await models.Student.aggregate([
        { $match: { status:"promoted"} },
        { $group: { _id: "$presentClass", count: { $sum: 1 } } },
    ]).exec();

    const survival = [
        {
            key: "Male",
            color: "#FE8A7D",
            values: survivalMale,
        },
        {
            key: "Female",
            color: "#1de9b6",
            values: survivalFemale,
        },
        {
            key: "Total",
            color: "#3ebfea",
            values: survivalTotal,
        },
    ]

    console.log({transition,repetition,survival, aNetIntake,grossEnroll, netEnroll, ageSpec, outOfSchool,})
    return res.status(200).json({
        message:"Fetched indicator",
        data:{
            survival,
            repetition,
            transition,
            outOfSchool, 
            ageSpec,
            netEnroll,
            grossEnroll, 
            aNetIntake, 
        },
    })
}


exports.createTeacher = async (req, res)=>{
    const {email} = req.body;
    const isTeacher = await  models.Teacher.findOne({email});
    if(isTeacher){
        return res.status(400).json({error:"Teacher already created"})
    }  
    const teacher = new models.Teacher(req.body);
    teacher.save((err, data)=>{
        // console.log({err, data})
        if(err || !data){
            return res.status(401).json({error:"error in creating Teacher, please try again",err})
        }
        res.status(200).status(200).json({message:"Teacher is successfully created", data})
    })
}
exports.teachers= async (req, res)=>{
    if(!req.params.district){
        return res.status(404).json({error:"District required"})
    }
    let district = mongoose.Types.ObjectId(req.params.district);
    models.Teacher.aggregate([
        { $match : {district}},
        { $lookup: { from: "schools", localField: "school", foreignField: "_id", as: "fromSchool" }},
        { $lookup: { from: "districts", localField: "fromSchool.district", foreignField: "_id", as: "fromDistrict" }}
    ]).exec((err, data)=>{
        console.log({err, data})
        if(err || !data)return res.status(404).json({error:"Teacher is not available",err})
        return res.status(200).status(200).json({"message":"Teacher is successfully fetched",data})
    })
}
exports.teacherById= async (req, res, next,id)=>{
    //let ids = mongoose.Types.ObjectId(id);
    models.Teacher.findById(id).populate("school").exec((err, teacher)=>{
        if(err || !teacher){ 
            return res.status(404).json({error: "Teacher not found"})
        }
        req.teacher = teacher;
        next()
    })
}

exports.teacher = async (req, res)=>{
    res.status(200).json({message:"teacher is succesfully fetched", data:req.teacher})
}
exports.updateTeacher = async (req, res) => {
    let teacher = _.extend(req.teacher,req.body);
    teacher.update_at = Date.now();
    teacher.save((err,data)=>{
        console.log({err, data})
        if(err ||!data) {
            return res.json({error: "error in update Teacher"})
        }
        res.status(200).json({data,message:"Teacher is succesfully updated"})
    })
};
exports.deleteTeacher = async (req, res) => {
    const teacher = req.teacher
    teacher.remove((err, data)=>{
        if(err){
            return res.status(400).json({error:"Error in deleting teacher"});
        }
        return res.status(200).json({message:"teacher is successfully deleted", data})
    })
};

exports.countTeacherBySchoolAll= async (req, res)=>{
     //const { session} = req.body
     if(!req.params.district){
        return res.status(404).json({error:"District required"})
    }
    // if(!session){
    //     return res.status(404).json({error:"Session required"})
    // }

    let district = mongoose.Types.ObjectId(req.params.district);
    // console.log(district)
    const male = await models.Teacher.aggregate([
        { $match: { $and: [{ gender: "Male" }, {district}]} },
        { $group: { _id: "$school", count: { $sum: 1 } } },
        { $lookup: { from: "schools", localField: "_id", foreignField: "_id", as: "fromSchool"}},
        { $replaceRoot: { newRoot: { $mergeObjects: [ { $arrayElemAt: [ "$fromSchool", 0 ] }, "$$ROOT" ] } }},
        { $project: { fromSchool: 0 } }
    ]).exec();
    const female = await models.Teacher.aggregate([
        { $match: { $and: [{ gender: "Female" }, {district}]} },
        { $group: { _id: "$school", count: { $sum: 1 } } },
        { $lookup: { from: "schools", localField: "_id", foreignField: "_id", as: "fromSchool"}},
        { $replaceRoot: { newRoot: { $mergeObjects: [ { $arrayElemAt: [ "$fromSchool", 0 ] }, "$$ROOT" ] } }},
        { $project: { fromSchool: 0 } }
    ]).exec();
    const total = await models.Teacher.aggregate([
        { $match: {district:district} },
        { $group: { _id: "$school", count: { $sum: 1 } } },
        { $lookup: { from: "schools", localField: "_id", foreignField: "_id", as: "fromSchool"}},
        { $replaceRoot: { newRoot: { $mergeObjects: [ { $arrayElemAt: [ "$fromSchool", 0 ] }, "$$ROOT" ] } }},
        { $project: { fromSchool: 0 } }
    ]).exec();
  
    const data = [
        {key: "Male",color: "#FE8A7D",values: male,},
        {key: "Female",color: "#1de9b6", values: female,},
        {key: "Total",color: "#3ebfea",values: total,},
    ]
    return res.status(200).json ({message:"Teacher successfully counted by School", data })
}

exports.countTeacherInSchoolByClass= async (req, res)=>{
    //const { session} = req.body
    if(!req.params.district){
       return res.status(404).json({error:"District required"})
    }
    if(!req.params.school){
        return res.status(404).json({error:"School required"})
     }
   // if(!session){
   //     return res.status(404).json({error:"Session required"})
   // }

   let district = mongoose.Types.ObjectId(req.params.district);
   let school = mongoose.Types.ObjectId(req.params.school);
//    console.log({district, school})
   const male = await models.Teacher.aggregate([
       { $match: { $and: [{ gender: "Male" }, {district},{school}]} },
       { $group: { _id: "$classTaking", count: { $sum: 1 } } },
       { $lookup: { from: "classes", localField: "_id", foreignField: "_id", as: "fromClass"}},
       { $replaceRoot: { newRoot: { $mergeObjects: [ { $arrayElemAt: [ "$fromClass", 0 ] }, "$$ROOT" ] } }},
       { $project: { fromClass: 0 } }
   ]).exec();
   const female = await models.Teacher.aggregate([
       { $match: { $and: [{ gender: "Female" }, {district}, {school}]} },
       { $group: { _id: "$classTaking", count: { $sum: 1 } } },
       { $lookup: { from: "classes", localField: "_id", foreignField: "_id", as: "fromClass"}},
       { $replaceRoot: { newRoot: { $mergeObjects: [ { $arrayElemAt: [ "$fromClass", 0 ] }, "$$ROOT" ] } }},
       { $project: { fromClass: 0 } }
   ]).exec();
   const total = await models.Teacher.aggregate([
    { $match: { $and: [{district}, {school}]} },
       { $group: { _id: "$classTaking", count: { $sum: 1 } } },
       { $lookup: { from: "classes", localField: "_id", foreignField: "_id", as: "fromClass"}},
       { $replaceRoot: { newRoot: { $mergeObjects: [ { $arrayElemAt: [ "$fromClass", 0 ] }, "$$ROOT" ] } }},
       { $project: { fromClass: 0 } }
   ]).exec();
 
   const data = [
       {key: "Male",color: "#FE8A7D",values: male,},
       {key: "Female",color: "#1de9b6", values: female,},
       {key: "Total",color: "#3ebfea",values: total,},
   ]
   return res.status(200).json ({message:"Teacher successfully counted by School", data })
}

exports.classesList = async (req, res)=>{
    models.Classes.find((err, data)=>{
        if(err) return res.status(400).json({error:"failed to fetch the list of the class"});
        return res.status(200).json({message:"successfully fetched the list of the classes", data})
    })
}

exports.sessions = async (req, res) =>{
    const data = await models.Session.find();
    if(!data) return res.status(400).json({error:"failed to fetch the list of the session"})
    return res.status(200).json({message:"session successfully fetched", data})
}
















































/*
const _ = require('lodash');
const mongoose = require("mongoose");
const models = require('../../../models/index');

exports.districtById= async (req, res, next,id)=>{
    // #swagger.start

    models.District.findById(id).exec((err, dist)=>{
        if(err || !dist){ 
            return res.status(404).json({error: "District not found"})
        }
        req.district = dist;
        next()
    })
    // #swagger.start
}

exports.district = async (req, res)=>{
    // #swagger.start
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
   
    res.status(200).json({message:"district succesfully fetched", data:req.district})
}

exports.updateDistrict = async (req, res) => {
    let district = req.district
    district = _.extend(district,req.body);
    district.update_at = Date.now();
    district.save((err,data)=>{
        if(err ||!data) {

            return res.json({error: "error in updating district"})
        }
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

        res.json({data,message:"district succesfully updated"})
    })
};

//   Admin School services 
export const createSchool = async (req, res) =>{
    const  {email}= req.body 
    const isSchool = await models.School.findOne({email})
    if(isSchool){
        return res.status(400).json({"error":"School email already exist"})
    }
    const schoo = new models.School(req.body)
    schoo.save((err, scho)=>{
        if(err || !scho){
            return  res.status(405).json({"error":"error in creating a school"})
        }
        res.status(200).json({"message":"school is created", school:scho})
    })
}

export const schools = async (req, res)=>{
    const data = await models.School.aggregate([
        { $lookup: { from: "districts", localField: "district", foreignField: "_id", as: "fromDistrict"}},
    ]).exec();

    if(!data){
       return res.status(404).json({error:"fails to get users"})
    }
    res.status(200).json({message:"schools successfully fetched", data})

}

export const schoolById = async (req, res, next, id) =>{
    let ids = mongoose.Types.ObjectId(id);
    const data = await models.School.aggregate([
        { $match: {_id:ids}},
        { $lookup: { from: "districts", localField: "district", foreignField: "_id", as: "fromDistrict"}},
    ]).exec();
    if(!data){
        res.status(404).json({"error":"school not found"})
    }
    req.school = data;
    next();
    
    // models.School.findById(id).populate("district").exec((err, data)=>{
    //     if(err || !data){
    //         res.status(404).json({"error":"school not found"})
    //     }
    //     req.school = data;
    //     next();
    // });
    
}
export const school = async(req, res) =>{
    return res.status(200).json({message:"school successfully fetched", data:req.school})
}

exports.updateSchool = async (req, res)=>{
    //let updateSch = req.school[0]
    //console.log(updateSch,req.body)
    //updateSch = _.extend(updateSch,req.body)
    //console.log(updateSch)
    res.status(200).json({message:"school successfully updated"})
    // updateSch.updatedAt = Date.now();
    // updateSch.save((err,data)=>{
    //     if(err || !data){
    //         return res.status(403).json({error:"error in updating school detail", err})
    //     }
    //     res.status(200).json({message:"school successfully updated", data})
    // })
}

exports.schoolByDistrict = async (req, res)=>{
    if(!req.body.district){
        return res.status(404).json({error:"District required"})
    }
    let district = mongoose.Types.ObjectId(req.body.district);
    const data = await models.School.aggregate([
        { $match : {district}}
    ]).exec();
    if(!data){
        res.status(404).json({"error":"school not found"})
    }
    res.status(200).json({message:"school fetched", data})
}

exports.deleteSchool = async (req, res)=>{
    let schol = req.school[0];
    //console.log(schol)
    return res.status(403).json({error:"fails to delete school"})
    // schol.remove((err, data)=>{
    //     if(err || !data){
    //         return res.status(403).json({error:"fails to delete school", err})
    //     }

    //     res.status(200).json({message:"school succesfully deleted", data})
    // })
}

exports.schoolData = async (req, res) =>{
    //count school data only within a district
    let district = mongoose.Types.ObjectId(req.body.district);    
    //let countSchool = await models.School.countDocuments();
    let countSchool = await models.School.aggregate([
        { $match : {district}},
        { $group : { _id:"$_id", count:{$sum:1}}},
    ]).exec();
    let countSchoolByDistrict = await models.School.aggregate([
        { $match : {district}},
        { $group : { _id:"$district", count:{$sum:1}}},
        { $lookup: { from: "districts", localField: "_id", foreignField: "_id", as: "fromDistrict"}},
        { $replaceRoot: { newRoot: { $mergeObjects: [ { $arrayElemAt: [ "$fromDistrict", 0 ] }, "$$ROOT" ] } }},
        { $project: { fromDistrict: 0 } },
        //{ $sort: { count: -1 } },
    ]).exec();
    let countSchoolByEduLevel = await models.School.aggregate([
        { $match : {district}},
        { $group : {_id:"$eduLevel", count:{$sum:1}}},
        { $sort: { count: -1 } },
    ]).exec();
    let countSchoolByownership = await models.School.aggregate([
        { $match : {district}},
        {$group : {_id:"$ownership", count:{$sum:1}}},
        { $sort: { count: -1 } },
    ]).exec();
    let countSchoolByType = await models.School.aggregate([
        { $match : {district}},
        {$group : {_id:"$schoolType", count:{$sum:1}}},
        { $sort: { count: -1 } },
    ]).exec();
    let countSchoolByCat = await models.School.aggregate([
        { $match : {district}},
        {$group : {_id:"$schoolCat", count:{$sum:1}}},
        { $sort: { count: -1 } },
    ]).exec();
    res.status(404).json({message:"school data", data:{countSchool, countSchoolByDistrict, countSchoolByEduLevel, countSchoolByownership, countSchoolByType, countSchoolByCat}})
}

exports.schoolDataByDistrict = async (req, res) =>{
    if(!req.body.district){
        return res.status(404).json({error:"District required"})
    }
    let district = mongoose.Types.ObjectId(req.body.district);
    let countSchool = await models.School.countDocuments({district});
    let countSchoolByDistrict = await models.School.aggregate([
        { $match : {district}},
        { $group : { _id:"$district", count:{$sum:1}}},
        { $lookup: { from: "districts", localField: "_id", foreignField: "_id", as: "fromDistrict"}},
        { $replaceRoot: { newRoot: { $mergeObjects: [ { $arrayElemAt: [ "$fromDistrict", 0 ] }, "$$ROOT" ] } }},
        { $project: { fromDistrict: 0 } },
        //{ $sort: { count: -1 } },
    ]).exec();
    let countSchoolByEduLevel = await models.School.aggregate([
        { $match : {district}},
        { $group : {_id:"$eduLevel", count:{$sum:1}}},
        { $sort: { count: -1 } },
    ]).exec();
    let countSchoolByownership = await models.School.aggregate([
        { $match : {district}},
        {$group : {_id:"$ownership", count:{$sum:1}}},
        { $sort: { count: -1 } },
    ]).exec();
    let countSchoolByType = await models.School.aggregate([
        { $match : {district}},
        {$group : {_id:"$schoolType", count:{$sum:1}}},
        { $sort: { count: -1 } },
    ]).exec();

    let countSchoolByCat = await models.School.aggregate([
        { $match : {district}},
        {$group : {_id:"$schoolCat", count:{$sum:1}}},
        { $sort: { count: -1 } },
    ]).exec();

    res.status(404).json({message:"school data", data:{countSchool, countSchoolByDistrict, countSchoolByEduLevel, countSchoolByownership, countSchoolByType, countSchoolByCat}})
}

// Admin Students services  

exports.createStudent = async (req, res) =>{
    
    // const {studentCode} = req.body;
    // const isStudent = await  models.Student.findOne({studentCode});
    // if(isStudent){
    //     return res.status(400).json({error:"Students already created"})
    // }  
    
    //console.log(req.body)
    const student = new models.Student(req.body);
    student.save((err, data)=>{
        //console.log({err, data})
        if(err || !data){
            return res.status(401).json({error:"error in creating student, please try again",err})
        }
        res.status(200).json({message:"students successfully created, you can now login", data})
    }) 
}

exports.studentById= async (req, res, next, id)=>{
    let ids = mongoose.Types.ObjectId(id);
    const data = await models.Student.aggregate([
        { $match: { _id: ids}},
        { $lookup: { from: "districts", localField: "district", foreignField: "_id", as: "fromDistrict"}},
        { $lookup: { from: "schools", localField: "school", foreignField: "_id", as: "fromSchool"}},
        { $lookup: { from: "sessions", localField: "session", foreignField: "_id", as: "fromSession"}},
        { $lookup: { from: "classes", localField: "presentClass", foreignField: "_id", as: "fromClass"}},
        //{ $replaceRoot: { newRoot: { $mergeObjects: [ { $arrayElemAt: [ "$fromDistrict", 0 ] }, "$$ROOT" ] } }},
        //{ $project: { fromDistrict: 0 } }
    ]).exec();

    //console.log({ data})
    if(!data){
        return res.status(404).json({error:"Students not found", err});
    }
    req.student = data;
    next();
    

    // models.Student.findById(id).populate("school").populate("presentClass").populate("session").exec((err, student)=>{
    //     if(err || !student){
    //         return res.status(404).json({error:"Students not found", err});
    //     }
    //     req.student = student;
    //     next();
    // })
  
}

exports.updateStudent = async (req, res)=>{
    let student = _.extend(req.student, req.body)
    student.update_at = Date.now();
    // student.save((err, data)=>{
    //     if(err){
    //        return res.status(403).json({error:"fails to update students", err})
    //     }
    //     res.status(200).json({message:"students update successful", data})
    // })
    return res.status(200).json({message:"students update successful"})
}

exports.deleteStudent = async (req, res)=>{
    let student = req.student[0];
    // student.remove((err, data)=>{
    //     if(err || !data){
    //         return res.status(403).json({error:"fails to delete student", err})
    //     }
    //     res.status(200).json({message:"Student succesfully deleted", data})
    // })
    return res.status(403).json({error:"fails to delete student"})
}

exports.student = async (req, res) =>{
    res.status(200).json({message:"student sucessfully fetched", data:req.student})
}

exports.students = async (req, res) =>{
    let district = mongoose.Types.ObjectId(req.body.district);
    const data = await models.Student.aggregate([
        { $match : {district}},
        { $lookup: { from: "districts", localField: "district", foreignField: "_id", as: "fromDistrict"}},
        { $lookup: { from: "schools", localField: "school", foreignField: "_id", as: "fromSchool"}},
        { $lookup: { from: "sessions", localField: "session", foreignField: "_id", as: "fromSession"}},
        { $lookup: { from: "classes", localField: "presentClass", foreignField: "_id", as: "fromClass"}},

        //{ $replaceRoot: { newRoot: { $mergeObjects: [ { $arrayElemAt: [ "$fromDistrict", 0 ] }, "$$ROOT" ] } }},
        //{ $project: { fromDistrict: 0 } }
    ]).exec();
    
    //console.log({data})
    if(!data){
       return res.status(404).json({error:"fails to get users"})
    }
    res.status(200).json({message:"students successfully fetched", data})

    // const students =await models.Student.find().populate("school").populate("presetClass").populate("subject").exec();
    // models.Student.find().populate("session").populate("school").populate("presentClass").exec((err, data)=>{
    //     console.log({err, data})
    //     if(err) return res.status(404).json({error:"students not founds"})
    //     res.status(200).json({message:"students successfully fetched", data})
    // });
    
}

exports.countStudentByClassAll = async (req, res)=>{
    const male = await models.Student.aggregate([
        { $match: { gender: "Male" } },
        { $group: { _id: "$presentClass", count: { $sum: 1 } } },
        { $lookup: { from: "classes", localField: "_id", foreignField: "_id", as: "fromClass"}},
        { $replaceRoot: { newRoot: { $mergeObjects: [ { $arrayElemAt: [ "$fromClass", 0 ] }, "$$ROOT" ] } }},
        { $project: { fromClass: 0 } }
    ]).exec();
    const female = await models.Student.aggregate([
        { $match: { gender: "Female" } },
        { $group: { _id: "$presentClass", count: { $sum: 1 } } },
        { $lookup: { from: "classes", localField: "_id", foreignField: "_id", as: "fromClass"}},
        { $replaceRoot: { newRoot: { $mergeObjects: [ { $arrayElemAt: [ "$fromClass", 0 ] }, "$$ROOT" ] } }},
        { $project: { fromClass: 0 } }
    ]).exec();
    const total = await models.Student.aggregate([
        { $group: { _id: "$presentClass", count: { $sum: 1 } } },
        { $lookup: { from: "classes", localField: "_id", foreignField: "_id", as: "fromClass"}},
        { $replaceRoot: { newRoot: { $mergeObjects: [ { $arrayElemAt: [ "$fromClass", 0 ] }, "$$ROOT" ] } }},
        { $project: { fromClass: 0 } }
    ]).exec();
  
    const data = [
        {
            key: "Male",
            color: "#FE8A7D",
            values: male,
        },
        {
            key: "Female",
            color: "#1de9b6",
            values: female,
        },
        {
            key: "Total",
            color: "#3ebfea",
            values: total,
        },
    ]
    return res.status(200).json ({message:"students successfully counted by Class", data })
}

exports.StudentData = async (req, res) =>{
    const countStudent = await models.Student.countDocuments();
    const countStudentByGender = await models.Student.aggregate([
        {$group: {  _id: "$gender", "count": { $sum: 1 }, total :{$sum:"$count"}}},
        {$addFields: { totalScore:{ $sum: "$count"} }},
    ]).exec();
    const countStudentByYear = await models.Student.aggregate([
        {$project : {year:{$year:"$yearAdmission"}}},
        {$group: {_id: "$year", count:{$sum:1},total:{$sum:+1}}}
    ]).exec();
    //const countStudentByClass = await this.countStudentByClassAll();
    const countStudentByClass = ({a:"hello", data:"data"})
    const countStudentBySchool = await models.Student.aggregate([
        {$group: {  _id: "$school", "count": { $sum: 1 } }},
        {$lookup: {from: "schools", localField:"_id", foreignField:"_id", as:"fromSchool"}}
    ]).exec();
    const countStudentByAge = await models.Student.aggregate([
        {$group :{ _id:"$age", count:{$sum:1}}}
    ]).exec();
    const countStudentByEduLevel = await models.Student.aggregate([
        {$group :{ _id:"$edulevel", count:{$sum:1}}}
    ]).exec();
    const countStudentByDistrict = await models.Student.aggregate([
        {$group :{ _id:"$district", count:{$sum:1}}},
        { $lookup: { from: "districts", localField: "_id", foreignField: "_id", as: "fromDistrict"}},
        { $replaceRoot: { newRoot: { $mergeObjects: [ { $arrayElemAt: [ "$fromDistrict", 0 ] }, "$$ROOT" ] } }},
        { $project: { fromDistrict: 0 } }
    ]).exec();
    const countStudentByReligion = await models.Student.aggregate([
        {$group :{ _id:"$religion", count:{$sum:1}}},
    ]).exec();
    const countStudentByCountry = await models.Student.aggregate([
        {$group :{ _id:"$country", count:{$sum:1}}},
    ]).exec();
    const countStudentByEthnicity = await models.Student.aggregate([
        {$group :{ _id:"$ethnicity", count:{$sum:1}}},
    ]).exec();
    const countStudentByProvince = await models.Student.aggregate([
        {$group :{ _id:"$province", count:{$sum:1}}},
    ]).exec();
    const countStudentBySession= await models.Student.aggregate([
        {$group :{ _id:"$session", count:{$sum:1}}},
        { $lookup: { from: "sessions", localField: "_id", foreignField: "_id", as: "fromSession"}},
        { $replaceRoot: { newRoot: { $mergeObjects: [ { $arrayElemAt: [ "$fromSession", 0 ] }, "$$ROOT" ] } }},
        { $project: { fromSession: 0 } }
    ]).exec();
    const countStudentByStatus= await models.Student.aggregate([
        {$group :{ _id:"$status", count:{$sum:1}}},
    ]).exec();
    res.status(200).json({message:"school data successfully fetched",data:{countStudent,countStudentByGender,countStudentByYear,countStudentByClass,countStudentBySchool,countStudentByAge,countStudentByEduLevel,countStudentByDistrict,countStudentByReligion,countStudentByCountry,countStudentByEthnicity,countStudentByProvince,countStudentBySession,countStudentByStatus} })
}

exports.countStudentByClassAllByDistrict = async (req, res)=>{
    let district = mongoose.Types.ObjectId(req.body.district);
    const male = await models.Student.aggregate([
        { $match: { $and: [{ gender: "Male" }, {district}]} },
        { $group: { _id: "$presentClass", count: { $sum: 1 } } },
        { $lookup: { from: "classes", localField: "_id", foreignField: "_id", as: "fromClass"}},
        { $replaceRoot: { newRoot: { $mergeObjects: [ { $arrayElemAt: [ "$fromClass", 0 ] }, "$$ROOT" ] } }},
        { $project: { fromClass: 0 } }
    ]).exec();
    const female = await models.Student.aggregate([
        //{ $match: { gender: "Female" } },
        { $match: { $and: [{ gender: "Female" }, {district}]} },
        { $group: { _id: "$presentClass", count: { $sum: 1 } } },
        { $lookup: { from: "classes", localField: "_id", foreignField: "_id", as: "fromClass"}},
        { $replaceRoot: { newRoot: { $mergeObjects: [ { $arrayElemAt: [ "$fromClass", 0 ] }, "$$ROOT" ] } }},
        { $project: { fromClass: 0 } }
    ]).exec();
    const total = await models.Student.aggregate([
        //{ $match: { gender: district } },
        { $group: { _id: "$presentClass", count: { $sum: 1 } } },
        { $lookup: { from: "classes", localField: "_id", foreignField: "_id", as: "fromClass"}},
        { $replaceRoot: { newRoot: { $mergeObjects: [ { $arrayElemAt: [ "$fromClass", 0 ] }, "$$ROOT" ] } }},
        { $project: { fromClass: 0 } }
    ]).exec();
  
    const data = [
        {
            key: "Male",
            color: "#FE8A7D",
            values: male,
        },
        {
            key: "Female",
            color: "#1de9b6",
            values: female,
        },
        {
            key: "Total",
            color: "#3ebfea",
            values: total,
        },
    ]
    return res.status(200).json ({message:"students successfully counted by Class", data })
}

exports.StudentDataByDistrict = async (req, res) =>{
    //const { session} = req.body
    if(!req.body.district){
        return res.status(404).json({error:"District required"})
    }
    // if(!session){
    //     return res.status(404).json({error:"Session required"})
    // }

    let district = mongoose.Types.ObjectId(req.body.district);
    console.log(district)

    const countStudent = await models.Student.countDocuments({district});
    const countStudentByGender = await models.Student.aggregate([
        {$match: {district}},
        {$group: {  _id: "$gender", "count": { $sum: 1 }, total :{$sum:"$count"}}},
        {$addFields: { totalScore:{ $sum: "$count"} }},
    ]).exec();
    const countStudentByYear = await models.Student.aggregate([
        {$match: {district}},
        {$project : {year:{$year:"$yearAdmission"}}},
        {$group: {_id: "$year",count:{$sum:1},total:{$sum:+1}}}
    ]).exec();
    //const countStudentByClass = await this.countStudentByClassAll();
    const countStudentByClass = ({a:"hello", data:"data"})
    const countStudentBySchool = await models.Student.aggregate([
        {$match: {district}},
        {$group: {  _id: "$school", "count": { $sum: 1 } }},
        {$lookup: {from: "schools", localField:"_id", foreignField:"_id", as:"fromSchool"}}
    ]).exec();
    const countStudentByAge = await models.Student.aggregate([
        {$match: {district}},
        {$group :{ _id:"$age", count:{$sum:1}}}
    ]).exec();
    const countStudentByEduLevel = await models.Student.aggregate([
        {$match: {district}},
        {$group :{ _id:"$edulevel", count:{$sum:1}}}
    ]).exec();
    const countStudentByDistrict = await models.Student.aggregate([
        {$match: {district}},
        {$group :{ _id:"$district", count:{$sum:1}}},
        { $lookup: { from: "districts", localField: "_id", foreignField: "_id", as: "fromDistrict"}},
    ]).exec();
    const countStudentByReligion = await models.Student.aggregate([
        {$match: {district}},
        {$group :{ _id:"$religion", count:{$sum:1}}},
    ]).exec();
    const countStudentByCountry = await models.Student.aggregate([
        {$match: {district}},
        {$group :{ _id:"$country", count:{$sum:1}}},
    ]).exec();
    const countStudentByEthnicity = await models.Student.aggregate([
        {$match: {district}},
        {$group :{ _id:"$ethnicity", count:{$sum:1}}},
    ]).exec();
    const countStudentByProvince = await models.Student.aggregate([
        {$match: {district}},
        {$group :{ _id:"$province", count:{$sum:1}}},
    ]).exec();
    const countStudentBySession= await models.Student.aggregate([
        { $match: {district}},
        { $group :{ _id:"$session", count:{$sum:1}}},
        { $lookup: { from: "sessions", localField: "_id", foreignField: "_id", as: "fromSession"}},
        { $replaceRoot: { newRoot: { $mergeObjects: [ { $arrayElemAt: [ "$fromSession", 0 ] }, "$$ROOT" ] } }},
        { $project: { fromSession: 0 } }
    ]).exec();
    const countStudentByStatus= await models.Student.aggregate([
        {$match: {district}},
        {$group :{ _id:"$status", count:{$sum:1}}},
    ]).exec();
    res.status(200).json({message:"school data successfully fetched",data:{countStudent,countStudentByGender,countStudentByYear,countStudentByClass,countStudentBySchool,countStudentByAge,countStudentByEduLevel,countStudentByDistrict,countStudentByReligion,countStudentByCountry,countStudentByEthnicity,countStudentByProvince,countStudentBySession,countStudentByStatus} })
}


exports.StudentDataBySchool = async (req, res) =>{
    if(!req.body.school){
        return res.status(404).json({error:"School required"})
    }
    let school= mongoose.Types.ObjectId(req.body.school);
    console.log({school})

    const countStudent = await models.Student.countDocuments({school});
    const countStudentByGender = await models.Student.aggregate([
        {$match: {school}},
        {$group: {  _id: "$gender", "count": { $sum: 1 }, total :{$sum:"$count"}}},
        {$addFields: { totalScore:{ $sum: "$count"} }},
    ]).exec();
    const countStudentByYear = await models.Student.aggregate([
        {$match: {school}},
        {$project : {year:{$year:"$yearAdmission"}}},
        {$group: {_id: "$year",count:{$sum:1},total:{$sum:+1}}}
    ]).exec();
    //const countStudentByClass = await this.countStudentByClassAll();
    // const countStudentByClass = ({a:"hello", data:"data"})
    // const countStudentBySchool = await models.Student.aggregate([
    //     {$match: {school}},
    //     {$group: {  _id: "$school", "count": { $sum: 1 } }},
    //     {$lookup: {from: "schools", localField:"_id", foreignField:"_id", as:"fromSchool"}}
    // ]).exec();
    const countStudentByAge = await models.Student.aggregate([
        {$match: {school}},
        {$group :{ _id:"$age", count:{$sum:1}}}
    ]).exec();
    const countStudentByEduLevel = await models.Student.aggregate([
        {$match: {school}},
        {$group :{ _id:"$edulevel", count:{$sum:1}}}
    ]).exec();
    // const countStudentByDistrict = await models.Student.aggregate([
    //     {$match: {school}},
    //     {$group :{ _id:"$school", count:{$sum:1}}},
    //     { $lookup: { from: "school", localField: "_id", foreignField: "_id", as: "fromSchool"}},
    // ]).exec();
    const countStudentByReligion = await models.Student.aggregate([
        {$match: {school}},
        {$group :{ _id:"$religion", count:{$sum:1}}},
    ]).exec();
    const countStudentByCountry = await models.Student.aggregate([
        {$match: {school}},
        {$group :{ _id:"$country", count:{$sum:1}}},
    ]).exec();
    const countStudentByEthnicity = await models.Student.aggregate([
        {$match: {school}},
        {$group :{ _id:"$ethnicity", count:{$sum:1}}},
    ]).exec();
    const countStudentByProvince = await models.Student.aggregate([
        {$match: {school}},
        {$group :{ _id:"$province", count:{$sum:1}}},
    ]).exec();
    const countStudentBySession= await models.Student.aggregate([
        { $match: {school}},
        { $group :{ _id:"$session", count:{$sum:1}}},
        { $lookup: { from: "sessions", localField: "_id", foreignField: "_id", as: "fromSession"}},
        { $replaceRoot: { newRoot: { $mergeObjects: [ { $arrayElemAt: [ "$fromSession", 0 ] }, "$$ROOT" ] } }},
        { $project: { fromSession: 0 } }
    ]).exec();
    const countStudentByStatus= await models.Student.aggregate([
        {$match: {school}},
        {$group :{ _id:"$status", count:{$sum:1}}},
    ]).exec();
    res.status(200).json({
        message:"school data successfully fetched",
        data:{countStudent,countStudentByGender,countStudentByYear,countStudentByAge,countStudentByEduLevel,countStudentByReligion,countStudentByCountry,countStudentByEthnicity,countStudentByProvince,countStudentBySession,countStudentByStatus} 
    })
}


exports.studentIndicators = async (req, res)=>{
    // Using query builder, we can latter move
    const {yearA, pclass} = req.body;
    const gi = await models.Student.find({/**explicit find by district *})
    .where('presentClass').equals(pclass).where('yearAdmission').equals(yearA).exec();
    //{district:"60d88b1a6040b7073c8112e0"}).where('presentClass').equals("60d103c2aa056b4de034ed42").where('yearAdmission').equals("2021").exec()
    const gir = await models.Student.find().where('presentClass').equals("60d103c2aa056b4de034ed42").where('yearAdmission').equals("2021-07-27T00:00:00.000Z").countDocuments();
    
    const grossInTake = await models.Student.aggregate([
        { $match: { presentClass: "", yearAdmission:"" } },
        { $group: { _id: "/* deep looking district by school *", count: { $sum: 1 } } },
    ]).exec();
    const netIntake = await models.Student.aggregate([
        { $match: { presentClass: "", yearAdmission:"", /**accept function against dob field to get year * } },
        { $group: { _id: "/* deep looking district by school *", count: { $sum: 1 } } },
    ]).exec();

    const aNetinTake = await models.Student.aggregate([
        { $match: { presentClass: "", yearAdmission:"", /**accept function against dob field to get year * } },
        { $group: { _id: "_id", count: { $sum: 1 } } },
    ]).exec();

    const netEnroll= await models.Student.aggregate([
        { $match: { yearAdmission:"", /**accept function against dob field to get year * } },
        { $group: { _id: "/** deep find by school EduLevel*", count: { $sum: 1 } } },
    ]).exec();

    return res.status(200).json({message:"indicators", gir,})
}

exports.indicators = async (req, res) =>{
    // const {year, classid, dob } = req.body;
    // let classId = mongoose.Types.ObjectId(classid);
    // result: { $and: [ { $gt: [ "$qty", 100 ] }, { $lt: [ "$qty", 250 ] } ] }
    // const grossIntake = await models.Student.aggregate([
    //     { $match: { $and: [ {presentClass:classId, yearAdmission:"2020"}]} },
    //     { $group: { _id: "$_id", count: { $sum: 1 } } },
    // ]).exec();

    // const netIntake = await models.Student.aggregate([
    //     { $match: { $and: [ {presentClass: classId, yearAdmission:"2020", age:[{ $lt:6, $gt:7}]}]} },
    //     { $group: { _id: "$_id", count: { $sum: 1 } } },
    // ]).exec();

    const aNetIntakeMale = await models.Student.aggregate([
        { $match: { $and: [ { yearAdmission:"2020",gender:"Male", age:[{ $lt:6, $gt:7}]}]} },
        { $group: { _id: "$_id", count: { $sum: 1 } } },
    ]).exec();
    const aNetIntakeFemale = await models.Student.aggregate([
        { $match: { $and: [ { yearAdmission:"2020",gender:"Female", age:[{ $lt:6, $gt:7}]}]} },
        { $group: { _id: "$_id", count: { $sum: 1 } } },
    ]).exec();
    const aNetIntakeTotal = await models.Student.aggregate([
        { $match: { $and: [ { yearAdmission:"2020", age:[{ $lt:6, $gt:7}]}]} },
        { $group: { _id: "$_id", count: { $sum: 1 } } },
    ]).exec();

    const aNetIntake = [
        {
            key: "Male",
            color: "#FE8A7D",
            values: aNetIntakeMale,
        },
        {
            key: "Female",
            color: "#1de9b6",
            values: aNetIntakeFemale,
        },
        {
            key: "Total",
            color: "#3ebfea",
            values: aNetIntakeTotal,
        },
    ]

    const grossEnrollMale = await models.Student.aggregate([
        { $match: { $and: [{session:"2020", gender:"Male"}]}},
        { $group: { _id: "$eduLevel", count: { $sum: 1 } } },
    ]).exec();
    const grossEnrollFemale = await models.Student.aggregate([
        { $match: { $and: [{session:"2020", gender:"Female"}]}},
        { $group: { _id: "$eduLevel", count: { $sum: 1 } } },
    ]).exec();
    const grossEnrollTotal = await models.Student.aggregate([
        { $match: { $and: [{session:"2020"}]}},
        { $group: { _id: "$eduLevel", count: { $sum: 1 } } },
    ]).exec();

    const grossEnroll = [
        {
            key: "Male",
            color: "#FE8A7D",
            values: grossEnrollMale,
        },
        {
            key: "Female",
            color: "#1de9b6",
            values: grossEnrollFemale,
        },
        {
            key: "Total",
            color: "#3ebfea",
            values: grossEnrollTotal,
        },
    ]

    const netEnrollMale = await models.Student.aggregate([
        { $match: { $and: [ { session:"2020", gender:"Male", age:[{ $lt:6, $gt:7}]}]} },
        { $group: { _id: "$eduLevel", count: { $sum: 1 } } },
    ]).exec();
    const netEnrollFemale = await models.Student.aggregate([
        { $match: { $and: [ { session:"2020",gender:"Female", age:[{ $lt:6, $gt:7}]}]} },
        { $group: { _id: "$eduLevel", count: { $sum: 1 } } },
    ]).exec();
    const netEnrollTotal= await models.Student.aggregate([
        { $match: { $and: [ { session:"2020",gender:"Female", age:[{ $lt:6, $gt:7}]}]} },
        { $group: { _id: "$eduLevel", count: { $sum: 1 } } },
    ]).exec();

    const netEnroll = [
        {
            key: "Male",
            color: "#FE8A7D",
            values: netEnrollMale,
        },
        {
            key: "Female",
            color: "#1de9b6",
            values: netEnrollFemale,
        },
        {
            key: "Total",
            color: "#3ebfea",
            values: netEnrollTotal,
        },
    ]

    const ageSpecMale = await models.Student.aggregate([
        { $match: { gender:"Male"}},
        { $group: { _id: "$age", count: { $sum: 1 } } },
    ]).exec();
    const ageSpecFemale = await models.Student.aggregate([
        { $match: { gender:"Female"}},
        { $group: { _id: "$age", count: { $sum: 1 } } },
    ]).exec();
    const ageSpecTotal = await models.Student.aggregate([
        { $group: { _id: "$age", count: { $sum: 1 } } },
    ]).exec();
    const ageSpec = [
        {
            key: "Male",
            color: "#FE8A7D",
            values: ageSpecMale,
        },
        {
            key: "Female",
            color: "#1de9b6",
            values: ageSpecFemale,
        },
        {
            key: "Total",
            color: "#3ebfea",
            values: ageSpecTotal,
        },
    ]

    const outOfSchoolMale = await models.Student.aggregate([
        { $match: { $and: [ { session:"2020", gender:"Male", age:[{ $lt:6, $gt:14}]}]} },
        { $group: { _id: "$_id", count: { $sum: 1 } } },
    ]).exec();
    const outOfSchoolFemale = await models.Student.aggregate([
        { $match: { $and: [ { session:"2020", gender:"Female", age:[{ $lt:6, $gt:14}]}]} },
        { $group: { _id: "$_id", count: { $sum: 1 } } },
    ]).exec();
    const outOfSchoolTotal = await models.Student.aggregate([
        { $match: { $and: [ { session:"2020", age:[{ $lt:6, $gt:14}]}]} },
        { $group: { _id: "$_id", count: { $sum: 1 } } },
    ]).exec();
    const outOfSchool = [
        {
            key: "Male",
            color: "#FE8A7D",
            values: outOfSchoolMale,
        },
        {
            key: "Female",
            color: "#1de9b6",
            values: outOfSchoolFemale,
        },
        {
            key: "Total",
            color: "#3ebfea",
            values: outOfSchoolTotal,
        },
    ]

    const transitionMale = await models.Student.aggregate([
        { $match: { $and: [ { session:"2020", status:"graduated", gender:"Male"}]} },
        { $group: { _id: "$edulevel", count: { $sum: 1 } } },
    ]).exec();
    const transitionFemale = await models.Student.aggregate([
        { $match: { $and: [ { session:"2020", status:"graduated", gender:"Female"}]} },
        { $group: { _id: "$edulevel", count: { $sum: 1 } } },
    ]).exec();
    const transitionTotal = await models.Student.aggregate([
        { $match: { $and: [ { session:"2020", status:"graduated"}]} },
        { $group: { _id: "$edulevel", count: { $sum: 1 } } },
    ]).exec();
    const transition = [
        {
            key: "Male",
            color: "#FE8A7D",
            values: transitionMale,
        },
        {
            key: "Female",
            color: "#1de9b6",
            values: transitionFemale,
        },
        {
            key: "Total",
            color: "#3ebfea",
            values: transitionTotal,
        },
    ]

    const repetitionMale = await models.Student.aggregate([
        { $match: { $and: [ { session:"2020", status:"repeater", gender:"Male"}]} },
        { $group: { _id: "$presentClass", count: { $sum: 1 } } },
    ]).exec();
    const repetitionFemale = await models.Student.aggregate([
        { $match: { $and: [ { session:"2020", status:"repeater", gender:"Female"}]} },
        { $group: { _id: "$presentClass", count: { $sum: 1 } } },
    ]).exec();
    const repetitionTotal = await models.Student.aggregate([
        { $match: { $and: [ { session:"2020", status:"repeater",}]} },
        { $group: { _id: "$presentClass", count: { $sum: 1 } } },
    ]).exec();

    const repetition = [
        {
            key: "Male",
            color: "#FE8A7D",
            values: repetitionMale,
        },
        {
            key: "Female",
            color: "#1de9b6",
            values: repetitionFemale,
        },
        {
            key: "Total",
            color: "#3ebfea",
            values: repetitionTotal,
        },
    ]

    const survivalMale = await models.Student.aggregate([
        { $match: { status:"promoted"} },
        { $group: { _id: "$presentClass", count: { $sum: 1 } } },
    ]).exec();
    const survivalFemale = await models.Student.aggregate([
        { $match: { status:"promoted"} },
        { $group: { _id: "$presentClass", count: { $sum: 1 } } },
    ]).exec();
    const survivalTotal = await models.Student.aggregate([
        { $match: { status:"promoted"} },
        { $group: { _id: "$presentClass", count: { $sum: 1 } } },
    ]).exec();

    const survival = [
        {
            key: "Male",
            color: "#FE8A7D",
            values: survivalMale,
        },
        {
            key: "Female",
            color: "#1de9b6",
            values: survivalFemale,
        },
        {
            key: "Total",
            color: "#3ebfea",
            values: survivalTotal,
        },
    ]

    console.log({transition,repetition,survival, aNetIntake,grossEnroll, netEnroll, ageSpec, outOfSchool,})
    return res.status(200).json({
        message:"Fetched indicator",
        data:{
            survival,
            repetition,
            transition,
            outOfSchool, 
            ageSpec,
            netEnroll,
            grossEnroll, 
            aNetIntake, 
        },
    })
}

exports.teachers= async (req, res)=>{
    let district = mongoose.Types.ObjectId(req.body.district);
    models.Teacher.aggregate([
        { $match : {district}},
        { $lookup: { from: "schools", localField: "school", foreignField: "_id", as: "fromSchool" }},
        { $lookup: { from: "districts", localField: "fromSchool.district", foreignField: "_id", as: "fromDistrict" }}
    ]).exec((err, data)=>{
        if(err || !data)return res.status(404).json({error:"Teacher is not available",err})
        return res.status(200).status(200).json({"message":"Teacher is successfully fetched",data})
    })
}
exports.teacherById= async (req, res, next,id)=>{
    //let ids = mongoose.Types.ObjectId(id);
    models.Teacher.findById(id).populate("school").exec((err, teacher)=>{
        if(err || !teacher){ 
            return res.status(404).json({error: "Teacher not found"})
        }
        req.teacher = teacher;
        next()
    })
}
exports.teacher = async (req, res)=>{
    //console.log(req.teacher)
    res.status(200).json({message:"teacher is succesfully fetched", data:req.teacher})
}
exports.updateTeacher = async (req, res) => {
    let teacher = _.extend(req.teacher,req.body);
    teacher.update_at = Date.now();
    teacher.save((err,data)=>{
        console.log({err, data})
        if(err ||!data) {
            return res.json({error: "error in update Teacher"})
        }
        res.status(200).json({data,message:"Teacher is succesfully updated"})
    })
};


exports.countTeacher = async (req, res)=>{
    //count teacher in district

}

exports.countTeacherByTypeOfstaff = async (req, res)=>{
    models.Teacher.aggregate([
        {
            $group : {_id:"$typeOfStaff",count:{$sum:1}}
        }
    ]).exec((err, data)=>{
        if(err || !data) return res.status(400).json({error : "Failed to count teacher by type of staff"})
        return res.status(200).json({message:"teachers successfully count by type of staff", data})
    })
}

exports.countTeacherByGender = async (req, res)=>{
    models.Teacher.aggregate([
        {
            $group : {_id:"$gender",count:{$sum:1}}
        }
    ]).exec((err, data)=>{
        if(err || !data) return res.status(400).json({error : "Failed to count teacher by gender"})
        return res.status(200).json({message:"teachers successfully count by gender", data})
    })
}
exports.countTeacherBySchoolAll = async (req, res)=>{
    const male = await models.Teacher.aggregate([
        { $match: { gender: "Male" } },
        { $group: { _id: "$school", count: { $sum: 1 } } },
        { $lookup: { from: "schools", localField: "_id", foreignField: "_id", as: "fromSchool"}},
        { $replaceRoot: { newRoot: { $mergeObjects: [ { $arrayElemAt: [ "$fromSchool", 0 ] }, "$$ROOT" ] } }},
        { $project: { fromSchool: 0 } }
    ]).exec();
    const female = await models.Teacher.aggregate([
        { $match: { gender: "Female" } },
        { $group: { _id: "$school", count: { $sum: 1 } } },
        { $lookup: { from: "schools", localField: "_id", foreignField: "_id", as: "fromSchool"}},
        { $replaceRoot: { newRoot: { $mergeObjects: [ { $arrayElemAt: [ "$fromSchool", 0 ] }, "$$ROOT" ] } }},
        { $project: { fromSchool: 0 } }
    ]).exec();
    const total = await models.Teacher.aggregate([
        { $group: { _id: "$school", count: { $sum: 1 } } },
        { $lookup: { from: "schools", localField: "_id", foreignField: "_id", as: "fromSchool"}},
        { $replaceRoot: { newRoot: { $mergeObjects: [ { $arrayElemAt: [ "$fromSchool", 0 ] }, "$$ROOT" ] } }},
        { $project: { fromSchool: 0 } }
    ]).exec();
  
    const data = [
        {
            key: "Male",
            color: "#FE8A7D",
            values: male,
        },
        {
            key: "Female",
            color: "#1de9b6",
            values: female,
        },
        {
            key: "Total",
            color: "#3ebfea",
            values: total,
        },
    ]
    return res.status(200).json ({message:"Teacher successfully counted by School", data })
}

exports.teacherData = async (req, res) =>{
    const countTeacher = await models.Teacher.countDocuments().exec()
    const countTeacherByTypeOfstaff = await models.Teacher.aggregate([
        {$group : {_id:"$typeOfStaff",count:{$sum:1}}}
    ]).exec()
    const countTeacherByGender = await models.Teacher.aggregate([
        {$group : {_id:"$gender",count:{$sum:1}}}
    ]).exec()
}


exports.countTeacherBySchoolAllByDistrict = async (req, res)=>{
    let district = mongoose.Types.ObjectId(req.body.district);
    const male = await models.Teacher.aggregate([
        { $match: { $and: [{ gender: "Male" }, {district}]} },
        { $group: { _id: "$school", count: { $sum: 1 } } },
        { $lookup: { from: "schools", localField: "_id", foreignField: "_id", as: "fromSchool"}},
        { $replaceRoot: { newRoot: { $mergeObjects: [ { $arrayElemAt: [ "$fromSchool", 0 ] }, "$$ROOT" ] } }},
        { $project: { fromSchool: 0 } }
    ]).exec();
    const female = await models.Teacher.aggregate([
        { $match: { $and: [{ gender: "Female" }, {district}]} },
        { $group: { _id: "$school", count: { $sum: 1 } } },
        { $lookup: { from: "schools", localField: "_id", foreignField: "_id", as: "fromSchool"}},
        { $replaceRoot: { newRoot: { $mergeObjects: [ { $arrayElemAt: [ "$fromSchool", 0 ] }, "$$ROOT" ] } }},
        { $project: { fromSchool: 0 } }
    ]).exec();
    const total = await models.Teacher.aggregate([
        { $match: {district:district} },
        { $group: { _id: "$school", count: { $sum: 1 } } },
        { $lookup: { from: "schools", localField: "_id", foreignField: "_id", as: "fromSchool"}},
        { $replaceRoot: { newRoot: { $mergeObjects: [ { $arrayElemAt: [ "$fromSchool", 0 ] }, "$$ROOT" ] } }},
        { $project: { fromSchool: 0 } }
    ]).exec();
  
    const data = [
        {key: "Male",color: "#FE8A7D",values: male,},
        {key: "Female",color: "#1de9b6", values: female,},
        {key: "Total",color: "#3ebfea",values: total,},
    ]
    return res.status(200).json ({message:"Teacher successfully counted by School", data })
}

exports.teacherDataByDistrict = async (req, res) =>{
    const countTeacher = await models.Teacher.countDocuments().exec()
    const countTeacherByTypeOfstaff = await models.Teacher.aggregate([
        { $match: { district: district } },
        {$group : {_id:"$typeOfStaff",count:{$sum:1}}}
    ]).exec()
    const countTeacherByGender = await models.Teacher.aggregate([
        { $match: { district: district } },
        {$group : {_id:"$gender",count:{$sum:1}}}
    ]).exec()
}
*/
