const { body,check, validationResult } = require('express-validator');

exports.studentSignupValidator = (req, res, next) => {
    req.check('studentId', 'Student Id is required').notEmpty();
    req.check('schoolCode', 'School code is required').notEmpty();
    req.check('firstName', 'First Name is required').notEmpty();
    req.check('middleName', 'moddle Name is required').notEmpty();
    req.check('lastName', 'last Name is required').notEmpty();
    req.check('religion', 'Religion is required').notEmpty();
    req.check('gender', 'gender is required').notEmpty();
    req.check('dob', 'Date of Birth  is required').notEmpty();
    req.check('country', 'Country is required').notEmpty();
    req.check('ethnicity', 'Ethnicity is required').notEmpty();
    req.check('province', 'Province is required').notEmpty();
    req.check('address', 'Address is required').notEmpty();
    req.check('yearAdmission', 'Year of admission is required').notEmpty();
    req.check('presentClass', 'present Class is required').notEmpty();
    req.check('session', 'Name is required').notEmpty();
    req.check('father', 'Father details is required').notEmpty();
    req.check('mother', 'Mother details is required').notEmpty();
    /*
    req.check('email', 'Email must be between 3 to 32 characters')
        .matches(/.+\@.+\..+/)
        .withMessage('Email must contain @')
        .isLength({
            min: 4,
            max: 32
        });
        */
    req.check('password', 'Password is required').notEmpty();
    req.check('password')
        .isLength({ min: 6 })
        .withMessage('Password must contain at least 6 characters')
        .matches(/\d/)
        .withMessage('Password must contain a number');
    //const errors = req.validationErrors();
    const errors = req.validationResult(req)
    if (errors) {
        const firstError = errors.map(error => error.msg)[0];
        return res.status(400).json({ error: firstError });
    }
    next();
};
